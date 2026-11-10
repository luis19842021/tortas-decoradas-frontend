import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { DatosTitular, Seccion } from "@/componenets/PaginaLegal";
import { MINUTOS_PARA_PAGAR, NEGOCIO, URL_DEFENSA_CONSUMIDOR } from "@/utils/datosLegales";

export const metadata: Metadata = {
    title: `Términos y condiciones | ${NEGOCIO}`,
    description: `Condiciones de compra y uso del sitio de ${NEGOCIO}.`,
};

export default function Terminos() {
    return (
        <PaginaLegal
            titulo="Términos y condiciones"
            subtitulo="Las reglas de compra y uso de nuestro sitio, explicadas con claridad."
        >
            <Seccion titulo="1. Quiénes somos">
                <p>Este sitio es operado por:</p>
                <DatosTitular />
            </Seccion>

            <Seccion titulo="2. Aceptación">
                <p>
                    Al registrarte, navegar o realizar una compra en este sitio aceptás estos términos y nuestra{" "}
                    <Link href="/privacidad" className="underline text-cyan-800">
                        política de privacidad
                    </Link>
                    . Si no estás de acuerdo, te pedimos que no uses el sitio.
                </p>
            </Seccion>

            <Seccion titulo="3. Nuestros productos">
                <p>
                    Elaboramos tortas, mesas dulces y mesas saladas de manera artesanal y por encargo. Las fotos del
                    sitio son ilustrativas: por tratarse de un trabajo hecho a mano, pueden existir pequeñas
                    diferencias de color, forma o decoración respecto de la imagen publicada.
                </p>
            </Seccion>

            <Seccion titulo="4. Alérgenos y pedidos especiales">
                <p>
                    Nuestros productos pueden contener o haber estado en contacto con gluten, huevo, leche, frutos
                    secos, soja y otros alérgenos. Si vos o quien recibe el pedido tienen alergias o restricciones
                    alimentarias, consultanos por WhatsApp antes de comprar. No podemos garantizar la ausencia
                    total de trazas.
                </p>
            </Seccion>

            <Seccion titulo="5. Precios y medios de pago">
                <p>
                    Los precios están expresados en pesos argentinos. El total, incluido el costo de envío cuando
                    corresponde, se muestra antes de pagar. Los precios pueden cambiar, pero siempre se respeta el
                    que viste al confirmar tu pedido.
                </p>
                <p>
                    Los pagos se procesan a través de Mercado Pago, con medios de pago de acreditación inmediata.
                    Nosotros no recibimos ni almacenamos los datos de tu tarjeta; solo conocemos el estado del
                    pago.
                </p>
            </Seccion>

            <Seccion titulo="6. Confirmación y plazo de pago">
                <p>
                    Al iniciar la compra, tu pedido queda reservado y tenés {MINUTOS_PARA_PAGAR} minutos para
                    completar el pago. Pasado ese plazo sin pago acreditado, el pedido se cancela automáticamente y
                    el cupo se libera para otros clientes.
                </p>
                <p>
                    El pedido queda confirmado cuando el pago se acredita. En ese momento te enviamos un correo con
                    el detalle.
                </p>
            </Seccion>

            <Seccion titulo="7. Fecha y modalidad de entrega">
                <p>
                    Al comprar elegís la fecha de entrega en el calendario del sitio, sujeta a disponibilidad de cupo y
                    con un mínimo de 2 días (48 horas) de anticipación: las fechas más cercanas figuran como no
                    disponibles. Podés optar por retirar
                    en nuestro local o por envío a domicilio, cuyo costo se calcula según la dirección indicada y se
                    muestra antes de pagar.
                </p>
                <p>
                    Es importante que cargues una dirección correcta y que haya alguien disponible para recibir el
                    pedido. Si la entrega no puede completarse por datos incorrectos o ausencia, un nuevo envío
                    puede tener un costo adicional que te informaremos.
                </p>
            </Seccion>

            <Seccion titulo="8. Cambios, cancelaciones y devoluciones">
                <p>
                    Las condiciones para cancelar, cambiar o reclamar un pedido están en{" "}
                    <Link href="/cambios-y-devoluciones" className="underline text-cyan-800">
                        Cambios y devoluciones
                    </Link>
                    .
                </p>
            </Seccion>

            <Seccion titulo="9. Tu cuenta">
                <p>
                    Para comprar necesitás crear una cuenta con datos verdaderos y verificar tu correo electrónico.
                    Sos responsable de mantener la confidencialidad de tu contraseña y de la actividad realizada
                    desde tu cuenta. Si notás un uso no autorizado, avisanos de inmediato.
                </p>
            </Seccion>

            <Seccion titulo="10. Propiedad intelectual">
                <p>
                    Las fotos, textos, logotipos y diseños del sitio pertenecen a {NEGOCIO} o se usan con
                    autorización. No pueden copiarse, modificarse ni reutilizarse con fines comerciales sin nuestro
                    permiso por escrito.
                </p>
            </Seccion>

            <Seccion titulo="11. Responsabilidad">
                <p>
                    Hacemos lo posible para que el sitio funcione sin interrupciones, pero no garantizamos su
                    disponibilidad continua ni nos hacemos responsables por fallas de servicios de terceros, como
                    Mercado Pago o la conexión a internet. Los productos son perecederos: después de la entrega,
                    su buen estado depende de que se conserven como te indicamos.
                </p>
            </Seccion>

            <Seccion titulo="12. Defensa del consumidor">
                <p>
                    Esta compra está amparada por la Ley 24.240 de Defensa del Consumidor. Si querés hacer un
                    reclamo, podés presentarlo en el{" "}
                    <a
                        href={URL_DEFENSA_CONSUMIDOR}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-cyan-800"
                    >
                        formulario de Defensa de las y los Consumidores
                    </a>
                    .
                </p>
            </Seccion>

            <Seccion titulo="13. Ley aplicable y jurisdicción">
                <p>
                    Estos términos se rigen por las leyes de la República Argentina. Para cualquier controversia,
                    serán competentes los tribunales ordinarios del domicilio real del consumidor.
                </p>
            </Seccion>

            <Seccion titulo="14. Cambios en estos términos">
                <p>
                    Podemos actualizar estos términos. La versión vigente es la publicada en esta página, con su
                    fecha de actualización. Los cambios no afectan a los pedidos ya confirmados.
                </p>
            </Seccion>
        </PaginaLegal>
    );
}
