import { useState } from "react";

const ContactForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    mensaje: "",
  });

  const [status, setStatus] = useState({
    ok: null,   // true | false | null
    msg: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ok: null, msg: "" });

    try {
      const res = await fetch("http://localhost:4000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error();

      setStatus({
        ok: true,
        msg: "Mensaje enviado correctamente"
      });

      setForm({ nombre: "", telefono: "", email: "", mensaje: "" });
    } catch (error) {
      console.log(error)
      setStatus({
        ok: false,
        msg: "Error al enviar el mensaje"
      });
    }
  };

  return (
    <form className="contactForm" onSubmit={handleSubmit}>
      <input
        name="nombre"
        type="text"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
      />

      <input
        name="telefono"
        type="tel"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={handleChange}
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <textarea
        name="mensaje"
        placeholder="Mensaje"
        value={form.mensaje}
        onChange={handleChange}
      />

      <button type="submit">ENVIAR</button>

      {status.msg && (
        <p
          style={{
            marginTop: "10px",
            color: status.ok ? "green" : "red",
            fontWeight: "600"
          }}
        >
          {status.msg}
        </p>
      )}
    </form>
  );
};

export default ContactForm;
