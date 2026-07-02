import DashboardLayout from '../components/DashboardLayout'
import styles from './Dashboard.module.css'

export default function EnConstruccion({ seccion }) {
  return (
    <DashboardLayout titulo={seccion} subtitulo="Sección del panel">
      <div className={styles.construccion}>
        <i className="bi bi-cone-striped"></i>
        <h2>En construcción</h2>
        <p>Esta sección estará disponible próximamente.</p>
      </div>
    </DashboardLayout>
  )
}
