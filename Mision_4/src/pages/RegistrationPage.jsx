import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registrationSchema } from '../schemas/registrationSchema.js'

const positions = ['Portero', 'Defensa', 'Centrocampista', 'Delantero']

export default function RegistrationPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: { nombre: '', apellidos: '', fechaNacimiento: '', posicion: '', emailContacto: '' },
  })

  const onSubmit = handleSubmit(() => {})

  return (
    <div className="page-wrap">
      <header className="page-heading">
        <div>
          <p className="eyebrow">TEMPORADA 2026 / 27 <span className="eyebrow-dot" /></p>
          <h1>Inscripción de jugador</h1>
          <p className="page-intro">Un nuevo capítulo empieza en el campo. Completa los datos para solicitar tu plaza en el equipo.</p>
        </div>
        <div className="season-badge" aria-label="Inscripciones abiertas"><span className="status-dot" /> PLAZAS ABIERTAS</div>
      </header>

      <div className="content-grid">
        <section className="form-card" aria-labelledby="form-title">
          <div className="card-heading">
            <div className="step-mark">01</div>
            <div>
              <h2 id="form-title">Datos del jugador</h2>
              <p>Cuéntanos un poco sobre ti</p>
            </div>
            <span className="required-note">* Campos obligatorios</span>
          </div>
          <form onSubmit={onSubmit} noValidate>
            <div className="field-grid">
              <label className="field">
                <span>Nombre <b>*</b></span>
                <input {...register('nombre')} placeholder="Ej. Alejandro" autoComplete="given-name" aria-invalid={!!errors.nombre} />
                {errors.nombre && <small className="field-error">{errors.nombre.message}</small>}
              </label>
              <label className="field">
                <span>Apellidos <b>*</b></span>
                <input {...register('apellidos')} placeholder="Ej. García López" autoComplete="family-name" aria-invalid={!!errors.apellidos} />
                {errors.apellidos && <small className="field-error">{errors.apellidos.message}</small>}
              </label>
              <label className="field">
                <span>Fecha de nacimiento <b>*</b></span>
                <input {...register('fechaNacimiento')} type="date" autoComplete="bday" aria-invalid={!!errors.fechaNacimiento} />
                {errors.fechaNacimiento && <small className="field-error">{errors.fechaNacimiento.message}</small>}
              </label>
              <label className="field">
                <span>Posición preferida <b>*</b></span>
                <select {...register('posicion')} aria-invalid={!!errors.posicion}>
                  <option value="">Selecciona una posición</option>
                  {positions.map((position) => <option key={position} value={position}>{position}</option>)}
                </select>
                {errors.posicion && <small className="field-error">{errors.posicion.message}</small>}
              </label>
              <label className="field field-full">
                <span>Correo electrónico de contacto <b>*</b></span>
                <input {...register('emailContacto')} type="email" placeholder="tu.correo@ejemplo.com" autoComplete="email" aria-invalid={!!errors.emailContacto} />
                {errors.emailContacto && <small className="field-error">{errors.emailContacto.message}</small>}
              </label>
            </div>
            <div className="form-footer">
              <p><span className="lock-icon">⌑</span> Tus datos se tratarán de forma confidencial.</p>
              <button className="submit-button" type="submit">Enviar inscripción <span aria-hidden="true">→</span></button>
            </div>
          </form>
        </section>

        <aside className="welcome-card">
          <div className="welcome-pattern" aria-hidden="true"><span /><span /><span /></div>
          <div className="welcome-content">
            <div className="mini-crest" aria-hidden="true"><span>LC</span><i>FC</i></div>
            <p className="welcome-kicker">MÁS QUE UN EQUIPO</p>
            <h2>El equipo<br />empieza contigo.</h2>
            <p className="welcome-copy">Pasión, compañerismo y fútbol. Aquí cada jugador cuenta desde el primer minuto.</p>
            <div className="welcome-divider" />
            <div className="welcome-season"><span>TEMPORADA</span><strong>2026 <i>/</i> 27</strong></div>
          </div>
          <div className="welcome-foot">LOS CHAVALES FC <span>·</span> DESDE 2014</div>
        </aside>
      </div>
      <footer className="page-footer"><span>LOS CHAVALES FC</span><span>Hechos de equipo. Hechos de fútbol. <b>✳</b></span></footer>
    </div>
  )
}
