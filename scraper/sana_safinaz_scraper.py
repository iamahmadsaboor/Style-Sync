import os
import json
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import urlparse
from datetime import datetime


class FashionScraper:
    def __init__(self):
        self.supported_stores = {
            'sanasafinaz': {
                'base_url': 'https://www.sanasafinaz.com/pk',
                'product_selector': 'div.product-item-info',
                'product_link_selector': 'a.product-item-link',
                'name_selector': 'strong.product.name.product-item-name',
                'image_selector': 'img.product-image-photo',
                'price_selector': 'span.price',
                'description_selector': 'div.product.attribute.description',
                'categories': {
                    'ready-to-wear': '/ready-to-wear.html',
                    'unstitched': '/unstitched.html',
                    'bottoms': '/bottoms.html'
                }
            }
        }

    def setup_driver(self):
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        options.add_argument('--window-size=1920,1080')
        options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        return webdriver.Chrome(options=options)

    def scrape_store(self, store_name, category):
        if store_name not in self.supported_stores:
            print(f"Store {store_name} not supported")
            return

        store_config = self.supported_stores[store_name]
        base_url = store_config['base_url']
        
        if category in store_config['categories']:
            url = base_url + store_config['categories'][category]
        else:
            print(f"Category {category} not found")
            return

        self.driver = self.setup_driver()
        try:
            print(f"\nScraping {store_name} - {category}")
            print(f"URL: {url}")
            self.driver.get(url)
            self._scrape_products(store_name, store_config)
        finally:
            self.driver.quit()

    def _scrape_products(self, store_name, store_config):
        wait = WebDriverWait(self.driver, 20)
        dataset_dir = self._create_dataset_structure(store_name)
        
        print("Waiting for page to load...")
        time.sleep(10)
        
        try:
            # Wait for products to be visible
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, store_config['product_selector'])))
            
            # Get all product elements
            products = self.driver.find_elements(By.CSS_SELECTOR, store_config['product_selector'])
            print(f"\nFound {len(products)} products")
            
            for idx, product in enumerate(products, 1):
                try:
                    print(f"\nProcessing product {idx}/{len(products)}")
                    
                    # Get product link
                    link = product.find_element(By.CSS_SELECTOR, store_config['product_link_selector'])
                    product_url = link.get_attribute('href')
                    print(f"Product URL: {product_url}")
                    
                    # Open product in new tab
                    self.driver.execute_script("window.open('');")
                    self.driver.switch_to.window(self.driver.window_handles[-1])
                    self.driver.get(product_url)
                    
                    # Extract product data
                    product_data = self._extract_product_data(store_config)
                    
                    # Save product data
                    self._save_product_data(product_data, dataset_dir)
                    
                    # Close tab and switch back
                    self.driver.close()
                    self.driver.switch_to.window(self.driver.window_handles[0])
                    
                except Exception as e:
                    print(f"Error processing product: {e}")
                    continue
                    
        except Exception as e:
            print(f"Error scraping products: {e}")

    def _extract_product_data(self, store_config):
        wait = WebDriverWait(self.driver, 10)
        
        try:
            # Get product name
            name_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, store_config['name_selector'])))
            product_name = name_element.text.strip()
            
            # Get all product images
            images = self.driver.find_elements(By.CSS_SELECTOR, store_config['image_selector'])
            image_urls = []
            for img in images:
                url = img.get_attribute('src')
                if url and url not in image_urls and 'placeholder' not in url:
                    # Get high-resolution image URL
                    url = url.split('?')[0]  # Remove URL parameters
                    image_urls.append(url)
            
            # Get price
            price_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, store_config['price_selector'])))
            price = price_element.text.strip()
            
            # Create metadata
            metadata = {
                'name': product_name,
                'url': self.driver.current_url,
                'price': price,
                'timestamp': datetime.now().isoformat(),
                'product_id': self._extract_product_id(self.driver.current_url)
            }
            
            return {'metadata': metadata, 'image_urls': image_urls}
            
        except Exception as e:
            print(f"Error extracting product data: {e}")
            return {'metadata': {}, 'image_urls': []}

    def _create_dataset_structure(self, store_name):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        dataset_dir = os.path.join('fashion_dataset', store_name, timestamp)
        os.makedirs(dataset_dir, exist_ok=True)
        return dataset_dir

    def _extract_product_id(self, url):
        # Extract product ID from URL
        parts = url.split('/')
        if parts:
            filename = parts[-1]
            return filename.split('.')[0]
        return None

    def _save_product_data(self, product_data, dataset_dir):
        try:
            # Create product folder
            product_id = product_data['metadata']['product_id']
            product_name = self._make_valid_filename(product_data['metadata']['name'])
            product_dir = os.path.join(dataset_dir, f"{product_id}_{product_name}")
            os.makedirs(product_dir, exist_ok=True)
            
            # Save metadata
            metadata_path = os.path.join(product_dir, "metadata.json")
            with open(metadata_path, 'w', encoding='utf-8') as f:
                json.dump(product_data['metadata'], f, indent=4, ensure_ascii=False)
            
            # Download images
            print(f"Downloading images for: {product_name}")
            for idx, img_url in enumerate(product_data['image_urls'], 1):
                self._download_image(img_url, product_dir, idx)
                
        except Exception as e:
            print(f"Error saving product data: {e}")

    def _make_valid_filename(self, s):
        # Remove invalid characters
        s = "".join(c for c in s if c.isalnum() or c in [' ', '-', '_']).strip()
        return s.replace(' ', '_')

    def _download_image(self, img_url, folder_path, idx):
        try:
            response = requests.get(img_url, stream=True)
            if response.status_code == 200:
                filename = f"image_{idx}.jpg"
                filepath = os.path.join(folder_path, filename)
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"Downloaded image {idx}")
                return True
        except Exception as e:
            print(f"Error downloading image {idx}: {e}")
        return False

if __name__ == "__main__":
    scraper = FashionScraper()
    scraper.scrape_store('sanasafinaz', 'ready-to-wear')
