import os
import json
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime


class JJUnstitchedScraper:
    def __init__(self):
        self.url = "https://www.junaidjamshed.com/mens/unstitched.html"
        options = webdriver.ChromeOptions()
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--window-size=1920,1080")
        self.driver = webdriver.Chrome(options=options)

    def create_dataset_structure(self):
        """Create the main dataset directory with timestamp"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.dataset_dir = os.path.join(
            "fashion_dataset", "junaidjamshed_unstitched", timestamp
        )
        os.makedirs(self.dataset_dir, exist_ok=True)
        return self.dataset_dir

    def download_image(self, img_url, folder_path, idx):
        """Download image and save to specified path"""
        try:
            response = requests.get(img_url, stream=True, timeout=10)
            if response.status_code == 200:
                filename = f"image_{idx}.jpg"
                filepath = os.path.join(folder_path, filename)
                with open(filepath, "wb") as f:
                    f.write(response.content)
                print(f"Downloaded image {idx}")
                return True
        except Exception as e:
            print(f"Error downloading image {idx}: {e}")
        return False

    def make_valid_filename(self, s):
        """Convert string to valid filename"""
        s = "".join(c for c in s if c.isalnum() or c in [" ", "-", "_"]).strip()
        return s.replace(" ", "_")

    def scrape_products(self):
        self.driver.get(self.url)
        dataset_dir = self.create_dataset_structure()
        page = 1

        while True:  # Continue until no more pages
            try:
                print(f"\nScraping page {page}...")

                # Wait for product grid to load
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located(
                        (By.CSS_SELECTOR, "div.product-item-info")
                    )
                )

                # Get all product items on current page
                product_items = self.driver.find_elements(
                    By.CSS_SELECTOR, "div.product-item-info"
                )

                for idx, item in enumerate(product_items, 1):
                    try:
                        # Extract basic product info
                        name = item.find_element(
                            By.CSS_SELECTOR, "h2.product.name.product-item-name a"
                        ).text.strip()

                        product_url = item.find_element(
                            By.CSS_SELECTOR, "h2.product.name.product-item-name a"
                        ).get_attribute("href")

                        # Create product directory
                        product_id = f"product_{((page-1)*36)+idx}"
                        product_name = self.make_valid_filename(name)
                        product_dir = os.path.join(
                            dataset_dir, f"{product_id}_{product_name}"
                        )
                        os.makedirs(product_dir, exist_ok=True)

                        # Get product details
                        product_data = self.get_product_details(
                            product_url, product_dir
                        )
                        product_data.update(
                            {"name": name, "url": product_url, "product_id": product_id}
                        )

                        # Save metadata
                        metadata_path = os.path.join(product_dir, "metadata.json")
                        with open(metadata_path, "w", encoding="utf-8") as f:
                            json.dump(product_data, f, ensure_ascii=False, indent=4)

                        print(f"\nProcessed product {((page-1)*36)+idx}: {name}")

                    except Exception as e:
                        print(f"Error scraping product: {str(e)}")
                        continue

                # Check for next page
                try:
                    next_page = self.driver.find_element(
                        By.CSS_SELECTOR, "li.pages-item-next"
                    )
                    if next_page:
                        next_page_link = next_page.find_element(By.TAG_NAME, "a")
                        next_page_url = next_page_link.get_attribute("href")
                        self.driver.get(next_page_url)
                        page += 1
                        time.sleep(2)
                    else:
                        break
                except:
                    print("\nNo more pages to scrape.")
                    break

            except Exception as e:
                print(f"Error: {str(e)}")
                break

        self.driver.quit()

    def get_product_details(self, url, product_dir):
        """Get additional product details and images from product page"""
        details = {}

        try:
            self.driver.execute_script("window.open('');")
            self.driver.switch_to.window(self.driver.window_handles[-1])
            self.driver.get(url)
            time.sleep(2)

            # Get price
            try:
                details["price"] = self.driver.find_element(
                    By.CSS_SELECTOR, "span.price"
                ).text.strip()
            except:
                details["price"] = ""

            # Get SKU
            try:
                details["sku"] = self.driver.find_element(
                    By.CSS_SELECTOR, "div.product.attribute.sku .value"
                ).text.strip()
            except:
                details["sku"] = ""

            # Get description
            try:
                details["description"] = self.driver.find_element(
                    By.CSS_SELECTOR, "div.product.attribute.overview .value"
                ).text.strip()
            except:
                details["description"] = ""

            # Get fabric details (specific to unstitched)
            try:
                details["fabric_details"] = self.driver.find_element(
                    By.CSS_SELECTOR, "div.product.attribute.fabric_details .value"
                ).text.strip()
            except:
                details["fabric_details"] = ""

            # Get and download images from MagicToolbox container
            try:
                # Find all thumbnail links in the MagicToolboxSelectorsContainer
                image_elements = self.driver.find_elements(
                    By.CSS_SELECTOR,
                    ".MagicToolboxSelectorsContainer .mt-thumb-switcher",
                )
                details["images"] = []

                for idx, img in enumerate(image_elements, 1):
                    # Get the high-resolution image URL from the href attribute
                    img_url = img.get_attribute("href")
                    if img_url and self.download_image(img_url, product_dir, idx):
                        details["images"].append(f"image_{idx}.jpg")

            except Exception as e:
                print(f"Error downloading images: {str(e)}")

            self.driver.close()
            self.driver.switch_to.window(self.driver.window_handles[0])

        except Exception as e:
            print(f"Error getting product details: {str(e)}")

        return details


def main():
    scraper = JJUnstitchedScraper()
    scraper.scrape_products()
    print("\nScraping completed!")


if __name__ == "__main__":
    main()
