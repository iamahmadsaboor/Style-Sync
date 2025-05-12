import os
import json
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime
from urllib.parse import urlparse


# Base Scraper for Reuse
class BaseScraper:
    def __init__(self):
        options = webdriver.ChromeOptions()
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--window-size=1920,1080")
        self.driver = webdriver.Chrome(options=options)

    def download_image(self, img_url, folder_path, idx):
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
        return (
            "".join(c if c.isalnum() or c in [" ", "-", "_"] else "" for c in s)
            .strip()
            .replace(" ", "_")
        )

    def quit_driver(self):
        self.driver.quit()


# Junaid Jamshed Men Scraper
class JJScraper(BaseScraper):
    def __init__(self, section):
        super().__init__()
        self.section = section
        self.urls = {
            "kameez_shalwar": "https://www.junaidjamshed.com/mens/kameez-shalwar.html",
            "unstitched": "https://www.junaidjamshed.com/mens/unstitched.html",
        }
        self.url = self.urls[self.section]

    def scrape(self):
        self.driver.get(self.url)
        dataset_dir = os.path.join(
            "fashion_dataset", self.section, datetime.now().strftime("%Y%m%d_%H%M%S")
        )
        os.makedirs(dataset_dir, exist_ok=True)
        print(f"Scraping {self.section}...")

        page = 1
        while True:
            try:
                products = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_all_elements_located(
                        (By.CSS_SELECTOR, "div.product-item-info")
                    )
                )
                for idx, product in enumerate(products, 1):
                    name = product.find_element(
                        By.CSS_SELECTOR, "h2.product.name a"
                    ).text.strip()
                    product_url = product.find_element(
                        By.CSS_SELECTOR, "h2.product.name a"
                    ).get_attribute("href")
                    print(f"Processing: {name}")
                    self.scrape_product_details(product_url, dataset_dir, idx, name)
                page += 1
                next_page = self.driver.find_elements(
                    By.CSS_SELECTOR, "li.pages-item-next a"
                )
                if next_page:
                    self.driver.get(next_page[0].get_attribute("href"))
                    time.sleep(2)
                else:
                    break
            except:
                break
        self.quit_driver()

    def scrape_product_details(self, url, base_dir, idx, name):
        self.driver.execute_script("window.open('');")
        self.driver.switch_to.window(self.driver.window_handles[-1])
        self.driver.get(url)
        folder = os.path.join(base_dir, f"{idx}_{self.make_valid_filename(name)}")
        os.makedirs(folder, exist_ok=True)

        image_elements = self.driver.find_elements(
            By.CSS_SELECTOR, ".MagicToolboxSelectorsContainer a.mt-thumb-switcher"
        )
        for i, img in enumerate(image_elements, 1):
            img_url = img.get_attribute("href")
            self.download_image(img_url, folder, i)

        with open(os.path.join(folder, "metadata.json"), "w") as f:
            json.dump({"name": name, "url": url}, f, indent=4)

        self.driver.close()
        self.driver.switch_to.window(self.driver.window_handles[0])


# Junaid Jamshed Women Scraper
class JJWomenScraper(BaseScraper):
    def __init__(self, section, url):
        super().__init__()
        self.section = section
        self.url = url

    def scrape(self):
        self.driver.get(self.url)
        dataset_dir = os.path.join(
            "fashion_dataset", self.section, datetime.now().strftime("%Y%m%d_%H%M%S")
        )
        os.makedirs(dataset_dir, exist_ok=True)
        print(f"Scraping {self.section}...")

        page = 1
        while True:
            try:
                products = WebDriverWait(self.driver, 10).until(
                    EC.presence_of_all_elements_located(
                        (By.CSS_SELECTOR, "div.product-item-info")
                    )
                )
                for idx, product in enumerate(products, 1):
                    try:
                        name = product.find_element(
                            By.CSS_SELECTOR, "h2.product.name a"
                        ).text.strip()
                        product_url = product.find_element(
                            By.CSS_SELECTOR, "h2.product.name a"
                        ).get_attribute("href")
                        print(f"Processing: {name}")

                        # Create product directory
                        product_id = f"product_{((page-1)*36)+idx}"
                        product_name = self.make_valid_filename(name)
                        product_dir = os.path.join(
                            dataset_dir, f"{product_id}_{product_name}"
                        )
                        os.makedirs(product_dir, exist_ok=True)

                        # Get product details and save
                        self.scrape_product_details(product_url, product_dir, name)
                    except Exception as e:
                        print(f"Error processing product: {e}")
                        continue

                # Check for next page
                next_page = self.driver.find_elements(
                    By.CSS_SELECTOR, "li.pages-item-next a"
                )
                if next_page:
                    self.driver.get(next_page[0].get_attribute("href"))
                    page += 1
                    time.sleep(2)
                else:
                    break
            except Exception as e:
                print(f"Error: {e}")
                break

        self.quit_driver()

    def scrape_product_details(self, url, product_dir, name):
        """Scrape individual product details"""
        self.driver.execute_script("window.open('');")
        self.driver.switch_to.window(self.driver.window_handles[-1])
        self.driver.get(url)
        time.sleep(2)

        try:
            # Get images
            image_elements = self.driver.find_elements(
                By.CSS_SELECTOR, ".MagicToolboxSelectorsContainer .mt-thumb-switcher"
            )

            # Save metadata
            metadata = {
                "name": name,
                "url": url,
                "price": self.driver.find_element(
                    By.CSS_SELECTOR, "span.price"
                ).text.strip(),
                "sku": self.driver.find_element(
                    By.CSS_SELECTOR, "div.product.attribute.sku .value"
                ).text.strip(),
                "images": [],
            }

            # Try to get additional details if available
            try:
                metadata["description"] = self.driver.find_element(
                    By.CSS_SELECTOR, "div.product.attribute.overview .value"
                ).text.strip()
            except:
                pass

            try:
                metadata["fabric_details"] = self.driver.find_element(
                    By.CSS_SELECTOR, "div.product.attribute.fabric_details .value"
                ).text.strip()
            except:
                pass

            # Download images
            for idx, img in enumerate(image_elements, 1):
                img_url = img.get_attribute("href")
                if img_url and self.download_image(img_url, product_dir, idx):
                    metadata["images"].append(f"image_{idx}.jpg")

            # Save metadata
            with open(
                os.path.join(product_dir, "metadata.json"), "w", encoding="utf-8"
            ) as f:
                json.dump(metadata, f, ensure_ascii=False, indent=4)

        except Exception as e:
            print(f"Error getting product details: {e}")

        self.driver.close()
        self.driver.switch_to.window(self.driver.window_handles[0])


# Sana Safinaz Scraper
class SanaSafinazScraper(BaseScraper):
    def __init__(self, category):
        super().__init__()
        self.base_url = "https://www.sanasafinaz.com/pk"
        self.category_url = f"{self.base_url}/{category}.html"

    def scrape(self):
        dataset_dir = os.path.join(
            "fashion_dataset", "sanasafinaz", datetime.now().strftime("%Y%m%d_%H%M%S")
        )
        os.makedirs(dataset_dir, exist_ok=True)
        print(f"Scraping Sana Safinaz Category: {self.category_url}")

        self.driver.get(self.category_url)
        time.sleep(5)
        products = self.driver.find_elements(By.CSS_SELECTOR, "div.product-item-info")
        for idx, product in enumerate(products, 1):
            product_name = product.find_element(
                By.CSS_SELECTOR, "strong.product.name"
            ).text.strip()
            image_element = product.find_element(
                By.CSS_SELECTOR, "img.product-image-photo"
            )
            img_url = image_element.get_attribute("src").split("?")[0]

            folder = os.path.join(
                dataset_dir, f"{idx}_{self.make_valid_filename(product_name)}"
            )
            os.makedirs(folder, exist_ok=True)
            self.download_image(img_url, folder, 1)

            with open(os.path.join(folder, "metadata.json"), "w") as f:
                json.dump({"name": product_name, "url": img_url}, f, indent=4)

        self.quit_driver()


class DynamicScraper:
    def __init__(self, base_url):
        self.base_url = base_url
        self.domain = urlparse(base_url).netloc

        options = webdriver.ChromeOptions()
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-notifications")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option("useAutomationExtension", False)
        self.driver = webdriver.Chrome(options=options)
        self.driver.execute_cdp_cmd(
            "Network.setUserAgentOverride",
            {
                "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
        )

    def create_dataset_structure(self):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.dataset_dir = os.path.join("fashion_dataset", self.domain, timestamp)
        os.makedirs(self.dataset_dir, exist_ok=True)
        return self.dataset_dir

    def download_image(self, img_url, folder_path, idx):
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            response = requests.get(img_url, stream=True, timeout=10, headers=headers)
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
        return (
            "".join(c for c in s if c.isalnum() or c in [" ", "-", "_"])
            .strip()
            .replace(" ", "_")
        )

    def get_selectors(self):
        """Get website-specific selectors"""
        if "khaadi" in self.domain:
            return {
                "product_grid": "div.product-item-info",
                "product_name": "a.product-item-link",
                "product_url": "a.product-item-link",
                "price": "span.price",
                "image_container": "div.gallery-placeholder img.gallery-placeholder__image",
                "next_page": "a.next",
            }
        else:
            return {
                "product_grid": "div.product-item-info",
                "product_name": "h2.product.name a",
                "product_url": "h2.product.name a",
                "price": "span.price",
                "image_container": ".MagicToolboxSelectorsContainer .mt-thumb-switcher",
                "next_page": "li.pages-item-next a",
            }

    def wait_for_element(self, selector, timeout=20):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, selector))
        )

    def scrape_products(self):
        try:
            print(f"Starting scrape of {self.base_url}")
            self.driver.get(self.base_url)
            dataset_dir = self.create_dataset_structure()
            page = 1
            selectors = self.get_selectors()

            # Initial page load wait
            time.sleep(5)

            while True:
                try:
                    print(f"\nScraping page {page}...")

                    # Wait for product grid and scroll
                    self.wait_for_element(selectors["product_grid"])
                    self.scroll_page()
                    time.sleep(2)

                    products = self.driver.find_elements(
                        By.CSS_SELECTOR, selectors["product_grid"]
                    )
                    print(f"Found {len(products)} products on page {page}")

                    for idx, product in enumerate(products, 1):
                        try:
                            name = product.find_element(
                                By.CSS_SELECTOR, selectors["product_name"]
                            ).text.strip()
                            product_url = product.find_element(
                                By.CSS_SELECTOR, selectors["product_url"]
                            ).get_attribute("href")

                            print(f"Processing: {name}")

                            product_id = f"product_{((page-1)*36)+idx}"
                            product_dir = os.path.join(
                                dataset_dir,
                                f"{product_id}_{self.make_valid_filename(name)}",
                            )
                            os.makedirs(product_dir, exist_ok=True)

                            self.scrape_product_details(
                                product_url, product_dir, name, selectors
                            )

                        except Exception as e:
                            print(f"Error processing product: {str(e)}")
                            continue

                    # Handle pagination
                    next_page = self.driver.find_elements(
                        By.CSS_SELECTOR, selectors["next_page"]
                    )
                    if next_page and next_page[0].is_displayed():
                        next_url = next_page[0].get_attribute("href")
                        self.driver.get(next_url)
                        page += 1
                        time.sleep(3)
                    else:
                        print("No more pages found.")
                        break

                except Exception as e:
                    print(f"Error on page {page}: {str(e)}")
                    break

        except Exception as e:
            print(f"Fatal error: {str(e)}")
        finally:
            self.driver.quit()

    def scroll_page(self):
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        while True:
            self.driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);"
            )
            time.sleep(2)
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

    def scrape_product_details(self, url, product_dir, name, selectors):
        try:
            self.driver.execute_script("window.open('');")
            self.driver.switch_to.window(self.driver.window_handles[-1])
            self.driver.get(url)
            time.sleep(3)

            metadata = {"name": name, "url": url, "images": []}

            # Get price
            try:
                metadata["price"] = self.driver.find_element(
                    By.CSS_SELECTOR, selectors["price"]
                ).text.strip()
            except:
                metadata["price"] = "N/A"

            # Get images
            try:
                if "khaadi" in self.domain:
                    image_elements = self.driver.find_elements(
                        By.CSS_SELECTOR, selectors["image_container"]
                    )
                    image_urls = [img.get_attribute("src") for img in image_elements]
                else:
                    image_elements = self.driver.find_elements(
                        By.CSS_SELECTOR, selectors["image_container"]
                    )
                    image_urls = [img.get_attribute("href") for img in image_elements]

                for idx, img_url in enumerate(image_urls, 1):
                    if img_url and self.download_image(img_url, product_dir, idx):
                        metadata["images"].append(f"image_{idx}.jpg")

            except Exception as e:
                print(f"Error getting images: {str(e)}")

            with open(
                os.path.join(product_dir, "metadata.json"), "w", encoding="utf-8"
            ) as f:
                json.dump(metadata, f, ensure_ascii=False, indent=4)

        except Exception as e:
            print(f"Error getting product details: {str(e)}")
        finally:
            self.driver.close()
            self.driver.switch_to.window(self.driver.window_handles[0])


def main():
    print("Enter the URL to scrape:")
    url = input().strip()

    scraper = DynamicScraper(url)
    scraper.scrape_products()
    print("\nScraping completed!")


if __name__ == "__main__":
    main()
