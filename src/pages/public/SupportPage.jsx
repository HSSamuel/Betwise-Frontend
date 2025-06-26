import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { FaChevronDown, FaRobot } from "react-icons/fa";
import { useChat } from "../../contexts/AppProviders"; // Import the hook
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth

const faqData = [
  {
    question: "How do I place a bet?",
    answer:
      "Simply navigate to the game you're interested in, click on the odds for the outcome you want to back, and it will be added to your bet slip.",
  },
  {
    question: "How do I deposit funds?",
    answer:
      'Go to your Wallet page and click the "Deposit" button. Follow the on-screen instructions to complete your transaction via Flutterwave.',
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we use industry-standard encryption and security protocols to protect all your personal and financial information.",
  },
];

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left font-semibold"
      >
        <span>{question}</span>
        <FaChevronDown
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-sm text-gray-600 dark:text-gray-400">
          {answer}
        </div>
      )}
    </div>
  );
};

const SupportPage = () => {
  const { user } = useAuth(); // Check if user is logged in
  const { toggleChat } = useChat();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Support Center</h1>

      <div className="space-y-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <form className="space-y-4">
            <Input type="text" placeholder="Your Name" required />
            <Input type="email" placeholder="Your Email" required />
            <textarea
              placeholder="Your Message..."
              rows="4"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 bg-gray-100"
              required
            ></textarea>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </Card>

        {/* Only show the AI chat card if a user is logged in */}
        {user && (
          <Card className="text-center">
            <FaRobot size={28} className="mx-auto text-green-500 mb-3" />
            <h2 className="text-xl font-bold mb-2">
              Need Immediate Assistance?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our AI Assistant is available 24/7 to help you with your queries.
            </p>
            <Button variant="secondary" onClick={toggleChat}>
              Launch AI Chatbot
            </Button>
          </Card>
        )}

        <Card>
          <h2 className="text-xl font-bold mb-2">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
