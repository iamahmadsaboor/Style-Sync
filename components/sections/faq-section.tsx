"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "@/components/ui/motion";

const faqs = [
  {
    question: "How accurate is the virtual try-on?",
    answer:
      "Our virtual try-on technology uses advanced AI algorithms to provide a highly accurate representation of how clothes will look on your body. While it's not perfect, most users find it extremely helpful for making purchasing decisions.",
  },
  {
    question: "Do I need special equipment to use StyleSync?",
    answer:
      "No special equipment is needed! StyleSync works on any device with a camera, including smartphones, tablets, and computers with webcams. Just take a photo or upload an existing one, and you're ready to start trying on clothes virtually.",
  },
  {
    question: "Is my personal data secure?",
    answer:
      "Absolutely. We take data privacy very seriously. Your photos and body measurements are encrypted and used solely for the purpose of the virtual try-on experience. We do not share your personal information with third parties without your explicit consent.",
  },
  {
    question: "Which clothing brands are available on StyleSync?",
    answer:
      "StyleSync partners with a wide range of clothing brands, from popular retail chains to boutique designers. We're constantly expanding our partnerships to offer even more options. You can view the full list of available brands in your account dashboard.",
  },
  {
    question: "Can I try on accessories like hats or jewelry?",
    answer:
      "Currently, StyleSync focuses on clothing items such as shirts, pants, dresses, and outerwear. We're working on expanding our technology to include accessories like hats, jewelry, and eyewear in future updates.",
  },
  {
    question: "How do I share my virtual try-on with friends?",
    answer:
      "After creating your virtual try-on, you'll see a 'Share' button that allows you to send the image via email, text message, or social media. You can also save the image to your device and share it manually.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Find answers to common questions about StyleSync and our virtual try-on technology.
            </p>
          </motion.div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Still have questions? Feel free to{" "}
              <a href="/contact" className="text-primary font-medium hover:underline">
                contact us
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}