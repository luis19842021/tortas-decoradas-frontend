import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { DatosTitular, Seccion } from "@/componenets/PaginaLegal";
import { NEGOCIO } from "@/utils/datosLegales";

export const metadata: Metadata = {
    title: `Política de privacidad | ${NEGOCIO}`,
    description: `Cómo ${NEGOCIO} recolecta, usa y protege tus datos personales.`,
};

export default function Privacidad() {
    return (
        <PaginaLegal
            titulo="Política de privacidad"
            subtitulo="Qué datos pedimos, para qué los usamos y cómo podés controlarlos."
        >
            <Seccion titulo="1. Responsable de los datos">
                <p>El responsable del tratamiento de tus datos personales es:</p>
                <DatosTitular />
            </Seccion>

            <Seccion titulo="2. Qué datos recolectamos">
                <ul className="list-disc pl-6 flex flex-col gap-1">
                    <li>Nombre, apellido, correo electrónico y teléfono, cuando creás tu cuenta.</li>
                    <li>Tu contraseña, que guardamos cifrada: nadie puede verla, ni nosotros.</li>
                    <li>Dirección y código postal de entrega, si elegís envío a domicilio.</li>
                    <li>Los pedidos que realizás, las fechas de entrega y el estado de cada pago.</li>
                </ul>
                <p>No pedimos datos que no necesitemos para vender y entregar tu pedido.</p>
            </Seccion>

            <Seccion titulo="3. Para qué los usamos">
                <ul className="list-disc pl-6 flex flex-col gap-1">
                    <li>Crear y verificar tu cuenta.</li>
                    <li>Procesar, preparar y entregar tus pedidos.</li>
                    <li>Enviarte correos sobre tu compra, la verificación de tu cuenta o la recuperación de tu clave.</li>
                    <li>Atender tus consultas y reclamos.</li>
                </ul>
                <p>No usamos tus datos para publicidad de terceros ni los vendemos.</p>
            </Seccion>

            <Seccion titulo="4. Pagos">
                <p>
                    Los pagos los procesa Mercado Pago. Los datos de tu tarjeta o cuenta se ingresan en su sitio y
                    nunca pasan por nuestros servidores. A nosotros nos informan únicamente si el pago fue aprobado,
                    pendiente o rechazado.
                </p>
            </Seccion>

            <Seccion titulo="5. Con quién compartimos datos">
                <p>
                    Solo compartimos lo necesario con los proveedores que hacen posible el servicio: Mercado Pago
                    para los pagos, un servicio de correo para enviarte los mensajes, un servicio de almacenamiento
                    de imágenes para las fotos del catálogo y los servicios de alojamiento del sitio. También
                    podemos informar datos si una autoridad competente lo exige legalmente.
                </p>
            </Seccion>

            <Seccion titulo="6. Almacenamiento en tu navegador">
                <p>
                    Usamos el almacenamiento local de tu navegador para mantener tu sesión iniciada y recordar el
                    contenido de tu carrito. No lo usamos para publicidad ni para seguirte en otros sitios. Podés
                    borrarlo cuando quieras desde la configuración de tu navegador; si lo hacés, deberás iniciar
                    sesión de nuevo.
                </p>
            </Seccion>

            <Seccion titulo="7. Cuánto tiempo los conservamos">
                <p>
                    Guardamos tus datos mientras tu cuenta esté activa y durante el tiempo que exijan las
                    obligaciones legales, contables o de atención de reclamos. Después los eliminamos o los
                    anonimizamos.
                </p>
            </Seccion>

            <Seccion titulo="8. Seguridad">
                <p>
                    Aplicamos medidas técnicas y organizativas para proteger tus datos, como conexión cifrada
                    (HTTPS) y contraseñas almacenadas de forma cifrada. Ningún sistema es infalible, pero
                    trabajamos para reducir los riesgos.
                </p>
            </Seccion>

            <Seccion titulo="9. Tus derechos">
                <p>
                    Podés acceder a tus datos, rectificarlos, actualizarlos o pedir su supresión escribiéndonos por
                    los medios de contacto de esta página. Responderemos dentro de los plazos legales.
                </p>
                <p>
                    El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los
                    mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un
                    interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº
                    25.326.
                </p>
                <p>
                    La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley Nº
                    25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes
                    resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de
                    protección de datos personales.
                </p>
            </Seccion>

            <Seccion titulo="10. Menores de edad">
                <p>
                    El sitio está dirigido a personas mayores de 18 años. No recolectamos intencionalmente datos de
                    menores. Si creés que un menor nos entregó datos, escribinos y los eliminaremos.
                </p>
            </Seccion>

            <Seccion titulo="11. Cambios en esta política">
                <p>
                    Podemos actualizar esta política. La versión vigente es la publicada en esta página. Para más
                    información sobre tu compra, consultá los{" "}
                    <Link href="/terminos" className="underline text-cyan-800">
                        términos y condiciones
                    </Link>
                    .
                </p>
            </Seccion>
        </PaginaLegal>
    );
}
