// Blog.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

const Blog: React.FC = () => { // Explicitly typing the functional component
  const blogPosts = [
    {
      id: 1,
      title: "5 Strategies for Shorter, More Effective Meetings",
      excerpt: "Discover practical tips to cut down meeting times without sacrificing outcomes. From clear agendas to timeboxing, make every minute count.",
      date: "July 10, 2025",
      imageUrl: "https://placehold.co/400x250/E0F2F7/2C3E50?text=Meeting+Tips"
    },
    {
      id: 2,
      title: "The Hidden Costs of Unproductive Meetings",
      excerpt: "Uncover the true financial and morale impact of poorly run meetings and learn how MeetingROI helps you mitigate these losses.",
      date: "June 28, 2025",
      imageUrl: "https://placehold.co/400x250/E8F5E9/2C3E50?text=Hidden+Costs"
    },
    {
      id: 3,
      title: "Leveraging AI for Better Meeting Outcomes",
      excerpt: "Explore how artificial intelligence can analyze meeting dynamics and predict productivity, guiding you towards more valuable collaborations.",
      date: "June 15, 2025",
      imageUrl: "https://placehold.co/400x250/FFF3E0/2C3E50?text=AI+in+Meetings"
    },
    {
      id: 4,
      title: "Action Items: The Key to Post-Meeting Success",
      excerpt: "Learn how diligent action item tracking transforms discussions into tangible progress and ensures follow-through on decisions.",
      date: "June 01, 2025",
      imageUrl: "https://placehold.co/400x250/FBE9E7/2C3E50?text=Action+Items"
    }
  ];

  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">Our Blog: Insights & Best Practices</h2>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Stay updated with the latest strategies, research, and tips to enhance meeting productivity and optimize your time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-48 object-cover rounded-t-lg"
              // FIX: Explicitly cast e.target to HTMLImageElement
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop if fallback also fails
                target.src = "https://placehold.co/400x250/CCCCCC/333333?text=Image+Error";
              }}
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-gray-700 text-sm mb-3">{post.date}</p>
              <p className="text-gray-700 leading-relaxed mb-4">{post.excerpt}</p>
              <a
                href="#"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
              >
                Read More <ArrowRight className="ml-1" size={18} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;