import React from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const SupportPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Support Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">How do I place a bet?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Simply navigate to the game you're interested in, click on the
                odds for the outcome you want to back, and it will be added to
                your bet slip.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">How do I deposit funds?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Go to your Wallet page and click the "Deposit" button. Follow
                the on-screen instructions to complete your transaction via
                Flutterwave.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Is my data secure?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Yes, we use industry-standard encryption and security protocols
                to protect all your personal and financial information.
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <form className="space-y-4">
            <Input type="text" placeholder="Your Name" required />
            <Input type="email" placeholder="Your Email" required />
            <textarea
              placeholder="Your Message..."
              rows="4"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              required
            ></textarea>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </Card>
      </div>
      <div className="text-center mt-8">
        <h2 className="text-xl font-bold mb-2">Need Immediate Assistance?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Our AI Assistant is available 24/7 to help you with your queries.
        </p>
        <Button variant="secondary">Launch AI Chatbot</Button>
      </div>
    </div>
  );
};

export default SupportPage;
