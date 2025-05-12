import os
import json
import requests
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime


class JJWomenScraper:
    def __init__(self, section, url):
        self.section = section  # stitched_women / unstitched_women
        self.url = url  # Target URL
        self.base_dir = os.path.join("fashion_dataset", self.section)
        os.makedirs(self.base_dir, exist_ok=True)

        # Selenium WebDriver Options
        options = webdriver.ChromeOptions()
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--window-size=1920,1080")
        self.driver = webdriver.Chrome(options=options)

    def make_valid_filename(self, s):
        """Make string safe for folder/file names"""
        return (
            "".join(c if c.isalnum() or c in [" ", "-", "_"] else "" for c in s)
            .replace(" ", "_")
            .strip()
        )

    def download_image(self, img_url, folder_path, idx):
        """Download image and save to specified folder"""
        try:
            response = requests.get(img_url, stream=True, timeout=10)
            if response.status_code == 200:
                filename = f"image_{idx}.jpg"
                filepath = os.path.join(folder_path, filename)
                with open(filepath, "wb") as f:
                    f.write(response.content)
                print(f"Downloaded: {filename}")
                return True
        except Exception as e:
            print(f"Failed to download {img_url}: {e}")
        return False

    def scrape_section(self):
        """Main scraper function"""
        self.driver.get(self.url)
        page = 1

        while True:
            print(f"\nScraping Page {page}...")
            try:
                # Wait for product grid to load
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_all_elements_located(
                        (By.CSS_SELECTOR, "li.item.product.product-item")
                    )
                )
                products = self.driver.find_elements(
                    By.CSS_SELECTOR, "li.item.product.product-item"
                )

                for idx, product in enumerate(products, 1):
                    try:
                        # Extract product details
                        product_name = product.find_element(
                            By.CSS_SELECTOR, "h2.product.name a"
                        ).text.strip()
                        product_link = product.find_element(
                            By.CSS_SELECTOR, "h2.product.name a"
                        ).get_attribute("href")
                        special_price = product.find_element(
                            By.CSS_SELECTOR, "span.special-price span.price"
                        ).text.strip()
                        old_price = product.find_element(
                            By.CSS_SELECTOR, "span.old-price span.price"
                        ).text.strip()

                        print(f"Processing: {product_name}")
                        folder_name = f"{idx}_{self.make_valid_filename(product_name)}"
                        product_folder = os.path.join(self.base_dir, folder_name)
                        os.makedirs(product_folder, exist_ok=True)

                        # Go to product detail page
                        self.get_product_details(
                            product_link,
                            product_folder,
                            product_name,
                            special_price,
                            old_price,
                        )

                    except Exception as e:
                        print(f"Error processing product: {e}")

                # Navigate to next page if exists
                next_button = self.driver.find_elements(
                    By.CSS_SELECTOR, "li.pages-item-next a"
                )
                if next_button:
                    self.driver.get(next_button[0].get_attribute("href"))
                    page += 1
                    time.sleep(2)
                else:
                    break

            except Exception as e:
                print(f"Error: {e}")
                break

        self.driver.quit()

    def get_product_details(
        self, product_url, product_folder, name, special_price, old_price
    ):
        """Extract details and images from product page"""
        try:
            self.driver.execute_script("window.open('');")
            self.driver.switch_to.window(self.driver.window_handles[-1])
            self.driver.get(product_url)
            time.sleep(2)

            # Extract sizes if available
            try:
                sizes = [
                    size.get_attribute("option-label")
                    for size in self.driver.find_elements(
                        By.CSS_SELECTOR, "div.swatch-option.text"
                    )
                ]
            except:
                sizes = []

            # Extract images
            image_elements = self.driver.find_elements(
                By.CSS_SELECTOR, ".MagicToolboxSelectorsContainer a.mt-thumb-switcher"
            )
            image_urls = [img.get_attribute("href") for img in image_elements]

            # Download images
            for idx, img_url in enumerate(image_urls, 1):
                self.download_image(img_url, product_folder, idx)

            # Save metadata
            metadata = {
                "name": name,
                "url": product_url,
                "special_price": special_price,
                "old_price": old_price,
                "sizes": sizes,
            }
            with open(
                os.path.join(product_folder, "metadata.json"), "w", encoding="utf-8"
            ) as f:
                json.dump(metadata, f, ensure_ascii=False, indent=4)
            print(f"Saved metadata for: {name}")

            self.driver.close()
            self.driver.switch_to.window(self.driver.window_handles[0])
        except Exception as e:
            print(f"Error fetching product details: {e}")


def main():
    sections = {
        "1": {
            "name": "stitched_women",
            "url": "https://www.junaidjamshed.com/womens/stitched.html",
        },
        "2": {
            "name": "unstitched_women",
            "url": "https://www.junaidjamshed.com/womens/un-stitched.html",
        },
    }

    print("Select Section to Scrape:")
    print("1. Stitched Women")
    print("2. Unstitched Women")
    choice = input("Enter 1 or 2: ").strip()

    if choice in sections:
        section_name = sections[choice]["name"]
        url = sections[choice]["url"]
        scraper = JJWomenScraper(section_name, url)
        scraper.scrape_section()
        print("\nScraping Completed Successfully!")
    else:
        print("Invalid Choice!")


if __name__ == "__main__":
    main()
