import Link from "next/link";
import { oi } from "../ui/fonts";
import { FaBirthdayCake, FaUsers, FaAward, FaGraduationCap, FaCookieBite, FaUtensils, FaHeart } from "react-icons/fa";

const DATOS = [
    { Icono: FaUsers, titulo: "Empresa familiar", texto: "Trabajamos en familia, con dedicación en cada pedido." },
    { Icono: FaAward, titulo: "Más de 10 años", texto: "De trayectoria elaborando tortas y mesas dulces." },
    { Icono: FaBirthdayCake, titulo: "Primerísima calidad", texto: "Materia prima de primerísima calidad en todo lo que hacemos." },
];

const SERVICIOS = [
    { Icono: FaBirthdayCake, titulo: "Tortas", texto: "Tortas decoradas a medida para cada celebración." },
    { Icono: FaCookieBite, titulo: "Mesa dulce", texto: "Todo lo dulce para completar tu evento." },
    { Icono: FaUtensils, titulo: "Mesa salada", texto: "Opciones saladas para acompañar la fiesta." },
];

const FORMACION = [
    "Seminarios de Decoradora de Tortas, nivel inicial y avanzado",
    "Seminario de Pintura sobre chocolate",
    "Curso de Pastelería Creativa en la Escuela de Arte Gastronómico",
];

export default function Nosotros() {
    return (
        <div className="w-full">
            <div className="flex flex-col justify-center items-center mt-5 md:mt-12 w-full py-6 bg-blue-200 px-4 text-center">
                <h1 className={`${oi.className} text-gray-600 text-3xl md:text-5xl`}>Nosotros</h1>
                <p className="text-cyan-900 mt-2 max-w-xl">
                    Una empresa familiar al servicio de tu celebración.
                </p>
            </div>

            <div className="max-w-5xl mx-auto w-full px-3 sm:px-4 py-8 flex flex-col gap-5 sm:gap-6">
                <div className="bg-blue-100 rounded-2xl p-4 sm:p-6 shadow-md">
                    <h2 className={`${oi.className} text-xl sm:text-2xl text-cyan-900 mb-3`}>Quiénes somos</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Somos una empresa familiar dedicada a la elaboración de tortas, mesa dulce y salada,
                        con materia prima de primerísima calidad.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {DATOS.map(({ Icono, titulo, texto }) => (
                        <div key={titulo} className="flex items-start gap-3 bg-white border-2 border-cyan-200 rounded-2xl p-4 shadow-sm">
                            <span className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-500 text-white shrink-0">
                                <Icono size={22} />
                            </span>
                            <span>
                                <span className="block text-lg font-bold text-cyan-900 leading-tight">{titulo}</span>
                                <span className="block text-sm text-gray-600 mt-1">{texto}</span>
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bg-[#bddbe8] rounded-2xl p-4 sm:p-6 shadow-md">
                    <h2 className={`${oi.className} text-xl sm:text-2xl text-cyan-900 mb-4`}>Qué hacemos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {SERVICIOS.map(({ Icono, titulo, texto }) => (
                            <div key={titulo} className="bg-white rounded-2xl p-4 text-center shadow-sm">
                                <span className="mx-auto mb-2 flex items-center justify-center h-12 w-12 rounded-full bg-[#09c99f] text-white">
                                    <Icono size={22} />
                                </span>
                                <p className="font-bold text-cyan-900">{titulo}</p>
                                <p className="text-sm text-gray-600 mt-1">{texto}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-blue-100 rounded-2xl p-4 sm:p-6 shadow-md">
                    <h2 className={`${oi.className} text-xl sm:text-2xl text-cyan-900 mb-3 flex items-center gap-2`}>
                        <FaGraduationCap /> Nuestra formación
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-3">
                        Con más de 10 años de trayectoria y capacitaciones realizadas a lo largo del tiempo, como:
                    </p>
                    <ul className="flex flex-col gap-2 mb-3">
                        {FORMACION.map((item) => (
                            <li key={item} className="flex items-start gap-2 bg-white rounded-xl px-3 py-2 shadow-sm text-gray-700">
                                <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#09c99f] shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                        Y seguimos actualizando nuestro aprendizaje hacia las nuevas técnicas y tendencias que
                        surgen todos los años.
                    </p>
                </div>

                <div className="bg-[#0f98c5] rounded-2xl p-5 sm:p-8 text-white text-center shadow-md">
                    <FaHeart className="mx-auto mb-3" size={28} />
                    <p className={`${oi.className} text-xl sm:text-2xl leading-snug max-w-2xl mx-auto`}>
                        Trabajamos con el objetivo de cumplir con la celebración soñada por nuestro cliente.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/productos?categoria=TORTAS&tipo=TORTA"
                            className="bg-[#09c99f] hover:bg-[#07a88a] text-white font-semibold px-6 py-2 rounded-full"
                        >
                            Ver tortas
                        </Link>
                        <Link
                            href="/contacto"
                            className="bg-white hover:bg-gray-100 text-[#0f98c5] font-semibold px-6 py-2 rounded-full"
                        >
                            Escribinos
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
