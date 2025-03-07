import { useState } from "react";
import axios from "axios";
const BearerToken = localStorage.getItem("token");

const SendNotifications = () => {
  const [messages, setMessages] = useState({
    class: "",
    teachers: "",
    students: "",
  });
  
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState({
    class: false,
    teachers: false,
    students: false,
  });

  const handleSend = async (recipientType) => {
    if (recipientType === 'class' && !className.trim()) {
      return alert('Please enter a class name');
    }

    try {
      setLoading(prev => ({ ...prev, [recipientType]: true }));
      
      let url;
      const data = { message: messages[recipientType] };
      
      switch(recipientType) {
        case 'class':
          url = `https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/sendToClass?classname=${encodeURIComponent(className)}`;
          break;
        case 'teachers':
          url = 'https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/sendToTeachers';
          break;
        case 'students':
          url = 'https://009e-2409-40c1-4144-6ae1-583b-e8fb-271c-5249.ngrok-free.app/admin/sendToStudents';
          break;
        default:
          throw new Error('Invalid recipient type');
      }

      await axios.get(url, data, {
        headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${BearerToken}`,
            "ngrok-skip-browser-warning": "true",
         }
      });
      
      setMessages(prev => ({ ...prev, [recipientType]: "" }));
      if (recipientType === 'class') setClassName("");
      alert(`Message sent to ${recipientType} successfully!`);
    } catch (error) {
      alert(`Failed to send message to ${recipientType}`);
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, [recipientType]: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Class Notification */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-center">Send to Class</h3>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class name (e.g., class11)"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={messages.class}
            onChange={(e) => setMessages(prev => ({ ...prev, class: e.target.value }))}
            placeholder="Enter message for class..."
            className="w-full h-32 p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSend('class')}
            disabled={loading.class || !className.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading.class ? 'Sending...' : 'Send to Class'}
          </button>
        </div>

        {/* Teachers Notification */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-center">Send to Teachers</h3>
          <textarea
            value={messages.teachers}
            onChange={(e) => setMessages(prev => ({ ...prev, teachers: e.target.value }))}
            placeholder="Enter message for teachers..."
            className="w-full h-32 p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => handleSend('teachers')}
            disabled={loading.teachers}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading.teachers ? 'Sending...' : 'Send to Teachers'}
          </button>
        </div>

        {/* Students Notification */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-center">Send to Students</h3>
          <textarea
            value={messages.students}
            onChange={(e) => setMessages(prev => ({ ...prev, students: e.target.value }))}
            placeholder="Enter message for students..."
            className="w-full h-32 p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={() => handleSend('students')}
            disabled={loading.students}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading.students ? 'Sending...' : 'Send to Students'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendNotifications;