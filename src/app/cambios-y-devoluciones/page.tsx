import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { DatosTitular, Seccion } from "@/componenets/PaginaLegal";
import { DIAS_ARREPENTIMIENTO, NEGOCIO, URL_DEFENSA_CONSUMIDOR } from "@/utils/datosLegales";

export const metadata: Metadata = {
    title: `Cambios y devoluciones | ${NEGOCIO}`,
    description: `Cómo cancelar, cambiar o reclamar un pedido de ${NEGOCIO}.`,
};

export default function CambiosYDevoluciones() {
    return (
        <PaginaLegal
            titulo="Cambios y devoluciones"
            subtitulo="Qué podés hacer si necesitás cancelar, cambiar o reclamar un pedido."
        >
            <Seccion titulo="1. Productos elaborados a pedido">
                <p>
                    Nuestras tortas y mesas dulces o saladas se elaboran a pedido, según lo que elegís, y son
                    productos perecederos. Por eso, el artículo 1116 del Código Civil y Comercial exceptúa estos
                    productos del derecho de arrepentimiento. Aun así, te ofrecemos la posibilidad de cancelar tu
                    pedido con las condiciones que figuran en el punto 2.
                </p>
                <p>
                    Si adquirís algún producto al que sí le corresponda el derecho de revocación, podés ejercerlo
                    dentro de los {DIAS_ARREPENTIMIENTO} días corridos desde que lo recibís, comunicándote con
                    nosotros por los medios de contacto de abajo.
                </p>
            </Seccion>

            <Seccion titulo="2. Cancelar un pedido ya pagado">
                <p>
                    Podés cancelar un pedido pagado desde la sección Historial de tu cuenta, mientras todavía no haya
                    sido entregado. Como cada pedido se prepara con anticipación para tu fecha, el monto que te
                    devolvemos depende de cuánto falte para la entrega:
                </p>
                <ul className="list-disc pl-6 flex flex-col gap-1">
                    <li>7 días o más antes de la entrega: te devolvemos el 90 % (retenemos el 10 %).</li>
                    <li>Entre 2 y menos de 7 días antes de la entrega: te devolvemos el 50 %.</li>
                    <li>Con menos de 2 días (48 horas) de anticipación: no hay devolución.</li>
                </ul>
                <p>
                    Los porcentajes se calculan sobre el total que pagaste, incluido el envío. Los días se cuentan
                    desde el momento en que cancelás hasta la fecha de entrega elegida. Antes de confirmar la
                    cancelación, el sitio te muestra el monto que te corresponde.
                </p>
                <p>
                    El reintegro lo gestionamos nosotros a través de Mercado Pago, y te avisamos por correo
                    electrónico cuando cancelás.
                </p>
            </Seccion>

            <Seccion titulo="3. Cambiar la fecha de entrega">
                <p>Podés reprogramar la fecha de entrega de tu pedido una sola vez, siempre que:</p>
                <ul className="list-disc pl-6 flex flex-col gap-1">
                    <li>el pedido todavía esté en etapa de diseño, antes de que comencemos la elaboración;</li>
                    <li>la nueva fecha tenga al menos 2 días (48 horas) de anticipación;</li>
                    <li>la nueva fecha tenga cupo disponible y no esté bloqueada.</li>
                </ul>
                <p>
                    Si necesitás cambiar la fecha otra vez, o el pedido ya está en elaboración, tendrás que cancelarlo
                    según las condiciones del punto anterior y hacer un pedido nuevo.
                </p>
            </Seccion>

            <Seccion titulo="4. Si hay un problema con tu pedido">
                <p>
                    Si tu pedido llega con un defecto, un error respecto de lo que compraste o en mal estado,
                    comunicate con nosotros el mismo día de la entrega, enviando fotos del producto y el número de
                    pedido. Según el caso, lo repondremos o te devolveremos el dinero.
                </p>
            </Seccion>

            <Seccion titulo="5. Si cancelamos nosotros">
                <p>
                    Si por una causa nuestra no podemos cumplir con tu pedido, te devolvemos el total pagado,
                    incluido el envío.
                </p>
            </Seccion>

            <Seccion titulo="6. Cómo se hacen los reintegros">
                <p>
                    Los reintegros se realizan por el mismo medio de pago utilizado, a través de Mercado Pago. El
                    plazo en que lo ves reflejado depende de tu medio de pago y de la entidad emisora.
                </p>
            </Seccion>

            <Seccion titulo="7. Pagos con problemas">
                <p>
                    Si el pago figura descontado pero el pedido no aparece confirmado, o si se cobró dos veces,
                    escribinos con el comprobante de Mercado Pago y lo resolvemos a la brevedad.
                </p>
            </Seccion>

            <Seccion titulo="8. Contacto">
                <DatosTitular />
                <p>
                    También podés presentar un reclamo ante la autoridad de defensa del consumidor en este{" "}
                    <a
                        href={URL_DEFENSA_CONSUMIDOR}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-cyan-800"
                    >
                        formulario
                    </a>
                    . Para más detalles de tu compra, consultá los{" "}
                    <Link href="/terminos" className="underline text-cyan-800">
                        términos y condiciones
                    </Link>
                    .
                </p>
            </Seccion>
        </PaginaLegal>
    );
}
