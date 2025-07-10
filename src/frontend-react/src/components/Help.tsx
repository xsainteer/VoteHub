import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Video,
  FileText,
  Users
} from 'lucide-react';

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I create a poll?",
      answer: "To create a poll, click the 'Create Poll' button in the header or navigate to Poll Management. Fill in your poll title, description (optional), add at least 2 options, and set an expiration date if needed. Click 'Create Poll' to publish it."
    },
    {
      question: "Can I edit a poll after creating it?",
      answer: "Currently, you cannot edit a poll after it's been created and has received votes. This ensures the integrity of the voting process. However, you can delete a poll if you're the creator."
    },
    {
      question: "How do I share my poll with others?",
      answer: "Each poll has a unique URL that you can share. You can copy the poll link from the poll details page or share it directly through social media platforms."
    },
    {
      question: "What happens when a poll expires?",
      answer: "When a poll expires, no new votes can be cast. The poll results remain visible, and you can still view all the analytics and statistics for that poll."
    },
    {
      question: "Can I see who voted on my poll?",
      answer: "VoteHub respects voter privacy. While you can see the total number of votes and results, individual voter identities are kept anonymous."
    },
    {
      question: "How do I delete a poll?",
      answer: "Only poll creators can delete their polls. Go to the poll details page and click the delete button (trash icon) in the top right corner. Confirm the deletion when prompted."
    },
    {
      question: "Is there a limit to how many polls I can create?",
      answer: "Currently, there's no limit to the number of polls you can create. Create as many as you need for your projects and decisions."
    },
    {
      question: "Can I export my poll data?",
      answer: "Yes! You can export your poll data from the Settings page. This includes all your polls, votes, and analytics in a downloadable format."
    }
  ];

  const quickLinks = [
    { title: "Getting Started Guide", icon: Book, description: "Learn the basics of using VoteHub" },
    { title: "Video Tutorials", icon: Video, description: "Watch step-by-step video guides" },
    { title: "Best Practices", icon: FileText, description: "Tips for creating effective polls" },
    { title: "Community Forum", icon: Users, description: "Connect with other VoteHub users" }
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      action: "Start Chat",
      available: "Available 24/7"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: Mail,
      action: "Send Email",
      available: "Response within 24 hours"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      icon: Phone,
      action: "Call Now",
      available: "Mon-Fri, 9AM-6PM EST"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-2">Find answers to your questions and get the help you need.</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, and guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <button
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all text-left group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
              <p className="text-sm text-gray-600">{link.description}</p>
            </button>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                {expandedFaq === index ? (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {expandedFaq === index && (
                <div className="px-4 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
          
          {filteredFaqs.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No FAQs found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
        <p className="text-gray-600 mb-6">
          Can't find what you're looking for? Our support team is here to help you get the most out of VoteHub.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div key={index} className="p-6 bg-gray-50 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                <p className="text-xs text-gray-500 mb-4">{option.available}</p>
                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  {option.action}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Need More Help?</h3>
          <p className="text-gray-600 mb-4">
            Check out our comprehensive documentation and community resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              View Documentation
            </button>
            <button className="px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 rounded-lg transition-colors">
              Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;