import { useState } from "react";

function Contact() {
  const [ok, setOk] = useState(false);

  return (
    <>
      <h2>Contact</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setOk(true);
        }}
      >
        <input placeholder="Your name" required />
        <input type="email" placeholder="Email" required />
        <textarea rows="5" placeholder="Tell me about your project" required />
        <button className="btn" style={{ width: "fit-content" }}>
          Send message
        </button>

        {ok && (
          <p style={{ color: "#ffb3bf" }}>
            Thanks! Connect the form to your email service to receive messages.
          </p>
        )}
      </form>
    </>
  );
}

export default Contact;
