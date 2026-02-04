import React from 'react';
import './ModalAppointmentConfirmed.css';
import { useNavigate } from 'react-router';

const ModalAppointmentConfirmed = ({ onClose }) => {
	const navigate = useNavigate();

	return (
		<section className="appointmentConfirmedModal">
			<div className="appointmentConfirmedGrid">
				<div className="appointmentConfirmedCard">
					<h3>Reserva confirmada</h3>
					<p>Tu cita se ha creado correctamente.</p>
					<div className="appointmentConfirmedActions">
						<button
							type="button"
							className="confirmBtn"
							onClick={() => {
								onClose?.();
								navigate('/profile');
							}}
						>
							Aceptar
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ModalAppointmentConfirmed;
