import os
import json
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime


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


def main():
    print("Select Scraper to Run:")
    print("1. Junaid Jamshed Men")
    print("2. Junaid Jamshed Women")
    print("3. Sana Safinaz")
    choice = input("Enter your choice (1-3): ").strip()

    if choice == "1":
        print("1. Kameez Shalwar\n2. Unstitched")
        section_choice = input("Enter section: ").strip()
        section = "kameez_shalwar" if section_choice == "1" else "unstitched"
        scraper = JJScraper(section)
        scraper.scrape()
    elif choice == "2":
        print("1. Stitched Women\n2. Unstitched Women")
        section_choice = input("Enter section: ").strip()
        url = (
            "https://www.junaidjamshed.com/womens/stitched.html"
            if section_choice == "1"
            else "https://www.junaidjamshed.com/womens/un-stitched.html"
        )
        section = "women_stitched" if section_choice == "1" else "women_unstitched"
        scraper = JJWomenScraper(section, url)
        scraper.scrape()
    elif choice == "3":
        print("1. Ready-to-Wear\n2. Unstitched\n3. Bottoms")
        cat_choice = input("Enter category: ").strip()
        categories = {"1": "ready-to-wear", "2": "unstitched", "3": "bottoms"}
        category = categories.get(cat_choice, "ready-to-wear")
        scraper = SanaSafinazScraper(category)
        scraper.scrape()
    else:
        print("Invalid choice!")


if __name__ == "__main__":
    main()
