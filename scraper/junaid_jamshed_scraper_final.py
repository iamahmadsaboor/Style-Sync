import os
import json
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime


class JJScraper:
    def __init__(self, section):
        # Set the URL based on the section selected
        self.section = section
        self.urls = {
            "kameez_shalwar": "https://www.junaidjamshed.com/mens/kameez-shalwar.html",
            "unstitched": "https://www.junaidjamshed.com/mens/unstitched.html",
        }
        self.url = self.urls[self.section]

        options = webdriver.ChromeOptions()
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--window-size=1920,1080")
        self.driver = webdriver.Chrome(options=options)

    def create_dataset_structure(self):
        """Create dataset directory with timestamp"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.dataset_dir = os.path.join("fashion_dataset", self.section, timestamp)
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
                return True
        except Exception as e:
            print(f"Error downloading image {idx}: {e}")
        return False

    def make_valid_filename(self, s):
        """Convert string to valid filename"""
        return (
            "".join(c if c.isalnum() or c in [" ", "-", "_"] else "" for c in s)
            .strip()
            .replace(" ", "_")
        )

    def scrape_products(self):
        self.driver.get(self.url)
        dataset_dir = self.create_dataset_structure()
        page = 1

        while True:
            try:
                print(f"\nScraping page {page}...")
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located(
                        (By.CSS_SELECTOR, "div.product-item-info")
                    )
                )

                # Get all product items on the page
                product_items = self.driver.find_elements(
                    By.CSS_SELECTOR, "div.product-item-info"
                )

                for idx, item in enumerate(product_items, 1):
                    try:
                        name = item.find_element(
                            By.CSS_SELECTOR, "h2.product.name.product-item-name a"
                        ).text.strip()
                        product_url = item.find_element(
                            By.CSS_SELECTOR, "h2.product.name.product-item-name a"
                        ).get_attribute("href")

                        product_id = f"product_{((page-1)*36)+idx}"
                        product_name = self.make_valid_filename(name)
                        product_dir = os.path.join(
                            dataset_dir, f"{product_id}_{product_name}"
                        )
                        os.makedirs(product_dir, exist_ok=True)

                        product_data = self.get_product_details(
                            product_url, product_dir
                        )
                        product_data.update(
                            {"name": name, "url": product_url, "product_id": product_id}
                        )

                        # Save metadata
                        with open(
                            os.path.join(product_dir, "metadata.json"),
                            "w",
                            encoding="utf-8",
                        ) as f:
                            json.dump(product_data, f, ensure_ascii=False, indent=4)

                        print(f"Processed product {((page-1)*36)+idx}: {name}")

                    except Exception as e:
                        print(f"Error scraping product: {e}")

                # Go to next page if exists
                try:
                    next_page = self.driver.find_element(
                        By.CSS_SELECTOR, "li.pages-item-next a"
                    )
                    self.driver.get(next_page.get_attribute("href"))
                    page += 1
                    time.sleep(2)
                except:
                    print("\nNo more pages to scrape.")
                    break

            except Exception as e:
                print(f"Error: {e}")
                break

        self.driver.quit()

    def get_product_details(self, url, product_dir):
        """Extract product details from the product page"""
        details = {}
        try:
            self.driver.execute_script("window.open('');")
            self.driver.switch_to.window(self.driver.window_handles[-1])
            self.driver.get(url)
            time.sleep(2)

            # Extract product details
            details["price"] = self.extract_element("span.price")
            details["sku"] = self.extract_element("div.product.attribute.sku .value")
            details["description"] = self.extract_element(
                "div.product.attribute.overview .value"
            )

            # Additional section-specific detail
            if self.section == "unstitched":
                details["fabric_details"] = self.extract_element(
                    "div.product.attribute.fabric_details .value"
                )

            # Download images
            image_elements = self.driver.find_elements(
                By.CSS_SELECTOR, ".MagicToolboxSelectorsContainer .mt-thumb-switcher"
            )
            details["images"] = []
            for idx, img in enumerate(image_elements, 1):
                img_url = img.get_attribute("href")
                if img_url and self.download_image(img_url, product_dir, idx):
                    details["images"].append(f"image_{idx}.jpg")

            self.driver.close()
            self.driver.switch_to.window(self.driver.window_handles[0])
        except Exception as e:
            print(f"Error getting product details: {e}")
        return details

    def extract_element(self, css_selector):
        """Helper to extract text from a CSS selector"""
        try:
            return self.driver.find_element(By.CSS_SELECTOR, css_selector).text.strip()
        except:
            return ""


def main():
    print("Select section to scrape:")
    print("1. Kameez Shalwar")
    print("2. Unstitched")
    choice = input("Enter 1 or 2: ").strip()

    if choice == "1":
        section = "kameez_shalwar"
    elif choice == "2":
        section = "unstitched"
    else:
        print("Invalid choice!")
        return

    scraper = JJScraper(section)
    scraper.scrape_products()
    print("\nScraping completed!")


if __name__ == "__main__":
    main()
