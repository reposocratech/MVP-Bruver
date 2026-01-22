const ContactForm = () => {
  return (
    <form className="contactForm">
      <input type="text" placeholder="Nombre" />
      <input type="tel" placeholder="Teléfono" />
      <input type="email" placeholder="Email" />
      <textarea placeholder="Mensaje"></textarea>
      <button type="submit">ENVIAR</button>
    </form>
  );
};
export default ContactForm;