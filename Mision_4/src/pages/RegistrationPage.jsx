import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { playerPositions, playerSchema } from '../schemas/playerSchema.js'
import { useCreatePlayer } from '../hooks/useCreatePlayer.js'

const fields = [
  { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ej. Alejandro', autoComplete: 'given-name' },
  { name: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Ej. García', autoComplete: 'family-name' },
  { name: 'dni', label: 'DNI', type: 'text', placeholder: '12345678Z', autoComplete: 'off', maxLength: 9 },
  { name: 'dorsal', label: 'Dorsal', type: 'number', placeholder: 'Ej. 10', inputMode: 'numeric' },
  { name: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date', autoComplete: 'bday' },
]

export default function RegistrationPage() {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      dni: '',
      dorsal: '',
      fechaNacimiento: '',
      posicion: '',
    },
  })
  const createPlayer = useCreatePlayer()

  const onSubmit = async (playerData) => {
    if (isSubmitting || createPlayer.isPending) return

    createPlayer.reset()
    try {
      await createPlayer.mutateAsync(playerData)
      resetForm()
    } catch {
      // El estado de error se presenta desde la mutation.
    }
  }

  const isSending = isSubmitting || createPlayer.isPending

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
          <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isSending}>
            <div className="field-grid">
              {fields.map(({ name, label, ...inputProps }) => {
                const error = errors[name]
                const errorId = `${name}-error`

                return (
                  <label className="field" htmlFor={name} key={name}>
                    <span>{label} <b aria-hidden="true">*</b></span>
                    <input
                      id={name}
                      {...register(name)}
                      {...inputProps}
                      aria-required="true"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? errorId : undefined}
                    />
                    {error && <small className="field-error" id={errorId} role="alert">{error.message}</small>}
                  </label>
                )
              })}

              <label className="field" htmlFor="posicion">
                <span>Posición <b aria-hidden="true">*</b></span>
                <select
                  id="posicion"
                  {...register('posicion')}
                  aria-required="true"
                  aria-invalid={Boolean(errors.posicion)}
                  aria-describedby={errors.posicion ? 'posicion-error' : undefined}
                >
                  <option value="">Selecciona una posición</option>
                  {playerPositions.map((position) => <option key={position} value={position}>{position}</option>)}
                </select>
                {errors.posicion && <small className="field-error" id="posicion-error" role="alert">{errors.posicion.message}</small>}
              </label>
            </div>

            <div className="form-footer">
              <p><span className="lock-icon" aria-hidden="true">⌑</span> Tus datos se tratarán de forma confidencial.</p>
              <button className="submit-button" type="submit" disabled={isSending}>
                {isSending ? 'Enviando inscripción…' : 'Enviar inscripción'}
                {!isSending && <span aria-hidden="true">→</span>}
              </button>
            </div>
            {createPlayer.isError && <p className="form-error" role="alert">{createPlayer.error.message}</p>}
            {createPlayer.isSuccess && <p className="form-success" role="status">Inscripción recibida correctamente. ¡Gracias por unirte al equipo!</p>}
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