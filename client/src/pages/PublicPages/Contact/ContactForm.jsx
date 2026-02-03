import React, { useState } from "react";
import { ZodError } from "zod";
import { contactSchema } from "../../../schemas/ContactShema.js";

const initialValue = {
  nombre: "",
  telefono: "",
  email: "",
  mensaje: "",
};

const ContactForm = () => {
  const [form, setForm] = useState(initialValue);
  const [valErrors, setValErrors] = useState({});
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setStatus("");
    setValErrors({});

    try {
      contactSchema.parse(form);

      const res = await fetch("http://localhost:4000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 200 || res.status === 201) {
        setStatus("Mensaje enviado");
        setForm(initialValue);
      } else {
        setStatus("Error al enviar mensaje");
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldsErrors = {};
        error.issues.forEach((elem) => {
          fieldsErrors[elem.path[0]] = elem.message;
        });
        setValErrors(fieldsErrors);
        setStatus("Error al enviar mensaje");
        return;
      }

      console.log(error);
      setStatus("Error al enviar mensaje");
    }
  };

  return (
    <form className="contactForm" onSubmit={onSubmit}>
      <input
        name="nombre"
        type="text"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
      />
      {valErrors.nombre && <p style={{ color: "red" }}>{valErrors.nombre}</p>}

      <input
        name="telefono"
        type="tel"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={handleChange}
      />
      {valErrors.telefono && <p style={{ color: "red" }}>{valErrors.telefono}</p>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      {valErrors.email && <p style={{ color: "red" }}>{valErrors.email}</p>}

      <textarea
        name="mensaje"
        placeholder="Mensaje"
        value={form.mensaje}
        onChange={handleChange}
      />
      {valErrors.mensaje && <p style={{ color: "red" }}>{valErrors.mensaje}</p>}

      <button type="submit">ENVIAR</button>

      {status && (
        <p
          style={{
            marginTop: 10,
            color: status === "Mensaje enviado" ? "green" : "red",
            fontWeight: 600,
          }}
        >
          {status}
        </p>
      )}
    </form>
  );
};

export default ContactForm;
