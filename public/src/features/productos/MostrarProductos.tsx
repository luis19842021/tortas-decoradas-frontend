"use client"
import { useState } from "react";
import Link from "next/link";
import { Pagination } from "@/componenets/Paginacion";
import { getCantTotalProduct, getCantTotalProductPiso, getCantTotalProductPisoSubcategoria, getCantTotalProductPorTipo, getCantTotalProductSubcategoria, getProductSegunCategoriaSub, getProductSegunPiso, getProductSegunPisoSubcategoria, getProductTipo } from "@/features/productos/api";
import { FaHandPointLeft } from "react-icons/fa";
import Cards from "@/componenets/Cards";
import { Producto } from "@/app/interfaces/producto.interface";
import { RiCheckboxBlankFill } from "react-icons/ri";
interface Pack {
  productos: Producto[],
  cantidad: number,
  categoriaSeleccionada?: String
}

export default function Product(paquete: Pack) {
  const categorias = [

    {
      cat: "Cupcakes",
      tipo: "CUPCAKE"
    },
    {
      cat: "Cake Pops",
      tipo: "CAKEPOPS"
    },
    {
      cat: "MiniDonas",
      tipo: "MINIDONAS"
    },
    {
      cat: "Desayunos",
      tipo: "VARIADO"
    },
    {
      cat: "Oreos Bañadas",
      tipo: "OREOS"
    },
    {
      cat: "Paletas",
      tipo: "PALETAS"
    },
    {
      cat: "Cookies",
      tipo: "GALLETA"
    },
    {
      cat: "Mesas Dulces",
      tipo: "VARIADO"
    },
    {
      cat: "Catering Salado",
      tipo: "VARIADO"
    }

  ]
  const subCategorias = [

    { nombre: "INFANTILES" },
    { nombre: "CASAMIENTOS" },
    { nombre: "ANIVERSARIOS" },
    { nombre: "CUMPLEAÑOS" },
    { nombre: "BABY  SHOWER" },
    { nombre: "GRADUACIONES" },
    { nombre: "HALLOWEEN" },
    { nombre: "NAVIDAD" },
    { nombre: "SAN VALENTIN" },
    { nombre: "DEPORTES" },
    { nombre: "SERIES/ANIME" },
    { nombre: "VIDEOJUEGOS" },
    { nombre: "COMUNION" },
    { nombre: "CONFIRMACION" },
    { nombre: "BAUTISMO" },
    { nombre: "PROFESIONES" },
    { nombre: "GOLOSINERAS" },
    { nombre: "ERÓTICOS" },
    { nombre: "ADULTOS" },
    { nombre: "DÍA DEL PADRE" },
    { nombre: "DÍA DE LA MUJER" },
    { nombre: "DÍA DEL AMIGO" },
    { nombre: "DÍA DEL NIÑO" },
    { nombre: "DÍA DE LA MADRE" },
    { nombre: "FIESTA DE 15 AÑOS" }
  ]
  const totalDePaginas = (cant: number) => {
    let totalPagina: number = 0
    let totalProducto: number = cant

    if (cant <= 12) {
      totalPagina = 1
    }
    if (cant > 12) {

      for (let index = 0; totalProducto > 0; index++) {
        if (totalProducto > 12) {
          totalProducto = totalProducto - 12
          totalPagina = totalPagina + 1
        }
        if (totalProducto <= 12) {
          totalProducto = 0
          totalPagina = totalPagina + 1

        }

      }

    }
    return totalPagina
  }

  const [categoria, SetCategoria] = useState<String>(paquete.categoriaSeleccionada ?? paquete.productos[0]?.categoria ?? "")

  const [subCategoria, setSubCategoria] = useState<String>("todas")
  const [produ, setProdu] = useState<Producto[]>(Object.values(paquete.productos ?? []));
  const [currentPage, setCurrentPage] = useState(1);
  const [checkUnPiso, setChekUnPiso] = useState<boolean>(false)
  const [checkDosPisos, setChekDosPisos] = useState<boolean>(false)
  const [checkTresPisos, setChekTresPisos] = useState<boolean>(false)
  const [origen, setOrigen] = useState<String>("todos")
  const [totalProductos, setTotalProductos] = useState<number>(paquete.cantidad)
  const [totalPaginas, setTotalpaginas] = useState<number>(totalDePaginas(totalProductos))
  const [errorPiso, setErrorPiso] = useState<boolean>(false)
  const [errorTematica, setErrorTematica] = useState<boolean>(false)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState<boolean>(false)

  const filtrarPorSubCategoria = async (subCatego: String) => {
    setFiltrosAbiertos(false)

    let nuevoProductos: Producto[] = []
    let total = totalProductos
    setCurrentPage(1)
    let tipo: String = ""
    if (paquete.productos[0]?.tipoDeProducto?.tipo) {
      tipo = paquete.productos[0].tipoDeProducto?.tipo
    }

    try {

    if (categoria == "TORTAS") {

      if (subCategoria == subCatego || subCatego == "todas") {
        setSubCategoria("todas")

        if (origen == "todos") {
          nuevoProductos = await getProductTipo("TORTA", "TORTAS", 0)
          total = await getCantTotalProduct("TORTA", "TORTAS")
          setTotalProductos(total)
        }
        if (origen == "unPiso") {
          nuevoProductos = await getProductSegunPiso(1, 0)
          total = await getCantTotalProductPiso(1)
          setTotalProductos(total)

        }
        if (origen == "dosPisos") {
          nuevoProductos = await getProductSegunPiso(2, 0)
          total = await getCantTotalProductPiso(2)
          setTotalProductos(total)
        }
        if (origen == "tresPisos") {
          nuevoProductos = await getProductSegunPiso(3, 0)
          total = await getCantTotalProductPiso(3)
          setTotalProductos(total)
        }

      }

      if (subCategoria != subCatego && subCatego != "todas") {
        setSubCategoria(subCatego)

        if (origen == "todos") {
          nuevoProductos = await getProductSegunCategoriaSub(categoria, subCatego, 0)
          total = await getCantTotalProductSubcategoria("TORTAS", subCatego)
          setTotalProductos(total)
        }
        if (origen == "unPiso") {
          nuevoProductos = await getProductSegunPisoSubcategoria(1, 0, subCatego)
          total = await getCantTotalProductPisoSubcategoria(1, subCatego)
          setTotalProductos(total)
        }
        if (origen == "dosPisos") {
          nuevoProductos = await getProductSegunPisoSubcategoria(2, 0 * 12, subCatego)
          total = await getCantTotalProductPisoSubcategoria(2, subCatego)
          setTotalProductos(total)
        }
        if (origen == "tresPisos") {
          nuevoProductos = await getProductSegunPisoSubcategoria(3, 0 * 12, subCatego)
          total = await getCantTotalProductPisoSubcategoria(3, subCatego)
          setTotalProductos(total)
        }
      }

    }

    if (categoria != "TORTAS") {

      if (subCategoria != subCatego && subCatego != "todas") {
        setSubCategoria(subCatego)
        nuevoProductos = await getProductSegunCategoriaSub(categoria, subCatego, 0)
        total = await getCantTotalProductSubcategoria(categoria, subCatego)
        setTotalProductos(total)
      }

      if (subCategoria == subCatego || subCatego == "todas") {
        setSubCategoria("todas")
        nuevoProductos = await getProductTipo(tipo, categoria, 0)
        total = await getCantTotalProductPorTipo(tipo, categoria)
        setTotalProductos(total)
      }
    }

    window.scrollTo(0, 0);
    setErrorTematica(false)
    setErrorPiso(false)
    setProdu(nuevoProductos)
    setTotalpaginas(totalDePaginas(total))

    } catch {
      console.error("Error:");
      setErrorTematica(true)
    }

  }

  const PISOS: Record<string, number> = { unPiso: 1, dosPisos: 2, tresPisos: 3 }

  const setPisoActivo = (n: number) => {
    setChekUnPiso(n === 1)
    setChekDosPisos(n === 2)
    setChekTresPisos(n === 3)
  }

  const pisoEstaActivo = (n: number) =>
    n === 1 ? checkUnPiso : n === 2 ? checkDosPisos : checkTresPisos

  // Tortas de todos los pisos, filtradas (o no) por temática
  const cargarTortasPorTematica = async (sub: String, offset: number) => {
    if (sub == "todas") {
      return {
        productos: await getProductTipo("TORTA", "TORTAS", offset),
        total: await getCantTotalProductPorTipo("TORTA", "TORTAS"),
      }
    }
    return {
      productos: await getProductSegunCategoriaSub("TORTAS", sub, offset),
      total: await getCantTotalProductSubcategoria("TORTAS", sub),
    }
  }

  // Tortas de un piso, filtradas (o no) por temática
  const cargarTortasPorPiso = async (n: number, sub: String, offset: number) => {
    if (sub == "todas") {
      return {
        productos: await getProductSegunPiso(n, offset),
        total: await getCantTotalProductPiso(n),
      }
    }
    return {
      productos: await getProductSegunPisoSubcategoria(n, offset, sub),
      total: await getCantTotalProductPisoSubcategoria(n, sub),
    }
  }

  const mostrarTortas = async (piso: String) => {
    setFiltrosAbiertos(false)
    let nuevoProductos: Producto[] = []
    let total = 0
    let hadError = false
    setCurrentPage(1)
    const n = PISOS[String(piso)]
    const esTortas = categoria == "TORTAS"
    const offset = esTortas ? 0 : (currentPage - 1) * 12

    if (n && esTortas && pisoEstaActivo(n)) {
      // Se destilda el piso: vuelve a mostrar todos
      setPisoActivo(0)
      setOrigen("todos")
      const r = await cargarTortasPorTematica(subCategoria, 0)
      nuevoProductos = r.productos
      total = r.total
      setTotalProductos(total)
    } else if (n) {
      try {
        const r = esTortas
          ? await cargarTortasPorPiso(n, subCategoria, 0)
          : await cargarTortasPorPiso(n, "todas", offset)
        nuevoProductos = r.productos
        total = r.total
        setTotalProductos(total)
        if (!esTortas) setSubCategoria("todas")
        setOrigen(piso)
        setPisoActivo(n)
      } catch {
        console.error("Error:")
        hadError = true
      }
    } else if (piso == "todos") {
      try {
        const r = esTortas
          ? await cargarTortasPorTematica(subCategoria, 0)
          : await cargarTortasPorTematica("todas", offset)
        nuevoProductos = r.productos
        total = r.total
        setTotalProductos(total)
        if (!esTortas) setSubCategoria("todas")
        setOrigen(piso)
        setPisoActivo(0)
      } catch {
        console.error("Error:")
        if (!esTortas) hadError = true
      }
    }

    if (hadError) {
      setErrorPiso(true)
      return
    }
    setErrorPiso(false)
    setErrorTematica(false)
    SetCategoria("TORTAS")
    setProdu(nuevoProductos)
    setTotalpaginas(totalDePaginas(total))
  }

  const pisoLegible = () => {
    if (origen == "unPiso") return "Un piso"
    if (origen == "dosPisos") return "Dos pisos"
    if (origen == "tresPisos") return "Tres pisos"
    return "Todos"
  }

  const tematicaLegible = () => {
    const t = String(subCategoria)
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
  }

  const handlePageChange = async (page: number) => {
    let tipo: String = ""
    if (paquete.productos[0]?.tipoDeProducto?.tipo) {
      tipo = paquete.productos[0].tipoDeProducto?.tipo
    }
    setCurrentPage(page)
    const offset = (page - 1) * 12
    const sinTematica = subCategoria == "todas"
    const piso = PISOS[String(origen)]
    let nuevoProductos: Producto[] | null = null

    if (categoria != "TORTAS") {
      nuevoProductos = sinTematica
        ? await getProductTipo(tipo, categoria, offset)
        : await getProductSegunCategoriaSub(categoria, subCategoria, offset)
    } else if (piso) {
      nuevoProductos = sinTematica
        ? await getProductSegunPiso(piso, offset)
        : await getProductSegunPisoSubcategoria(piso, offset, subCategoria)
    } else if (origen == "todos") {
      nuevoProductos = sinTematica
        ? await getProductTipo("TORTA", "TORTAS", offset)
        : await getProductSegunCategoriaSub("TORTAS", subCategoria, offset)
    }

    if (nuevoProductos) setProdu(nuevoProductos)
    window.scrollTo(0, 0);
  };

  return (
    <div>

      <div className="flex justify-center">productos </div>

      <div className="flex flex-col lg:flex-row lg:justify-center pb-12 px-3 lg:px-0">

        <button
          type="button"
          onClick={() => setFiltrosAbiertos((v) => !v)}
          className="lg:hidden flex items-center justify-between w-full bg-blue-100 rounded-lg px-4 py-3 mb-3 text-lg font-bold text-black cursor-pointer"
        >
          <span>Categorías y temáticas</span>
          <span className={`transition-transform ${filtrosAbiertos ? "rotate-180" : ""}`}>▾</span>
        </button>

        <div className={`${filtrosAbiertos ? "block" : "hidden"} lg:block bg-blue-100 w-full lg:w-55 rounded-lg lg:rounded-none lg:rounded-l-lg p-4 lg:pt-16 mb-3 lg:mb-0`} >
          <div><p className="text-black text-2xl font-bold">Categorias</p></div>

          <div className="pt-4">

            <div className={`block px-1 w-full py-1   `}  >
              <div className="flex items-center ">
                <Link href={`/productos?categoria=TORTAS&tipo=TORTA`}
                  className={` text-lg font-medium  ${categoria == "TORTAS" ? "text-naja" : ""} `}>
                  Tortas
                </Link>
                <FaHandPointLeft className={` text-lg font-medium text-orange-300 ml-5 ${categoria == "TORTAS" ? "visible" : "invisible"} `} />
              </div>

              <div className="flex justify-between items-center pl-4"><p className="font-mono">Un Piso</p> <RiCheckboxBlankFill onClick={() => mostrarTortas("unPiso")} className={`${origen == "unPiso" ? "text-pink-300" : "text-white "}  size-5 border-naja bg-naja mr-2 cursor-pointer`} /></div>
              <div className="flex justify-between items-center pl-4"><p className="font-mono">Dos Pisos</p> <RiCheckboxBlankFill onClick={() => mostrarTortas("dosPisos")} className={`${origen == "dosPisos" ? "text-pink-300" : "text-white "}  size-5 border-naja bg-naja mr-2 cursor-pointer`} /></div>
              <div className="flex justify-between items-center pl-4"><p className="font-mono">Tres Pisos</p> <RiCheckboxBlankFill onClick={() => mostrarTortas("tresPisos")} className={`${origen == "tresPisos" ? "text-pink-300" : "text-white "}  size-5 border-naja bg-naja mr-2 cursor-pointer`} /></div>
              <div className="flex justify-between items-center pl-4"><p className="font-mono">Todos</p> <RiCheckboxBlankFill onClick={() => mostrarTortas("todos")} className={`${origen == "todos" && categoria == "TORTAS" ? "text-pink-300" : "text-white "}  size-5 border-naja bg-naja mr-2 cursor-pointer`} /></div>
            </div>

            <ul>
              {categorias.map((catego, slideIndex) => (
                <li key={slideIndex} className={`block px-1 w-full py-1  hover:bg-red-100  `}  >
                  <div className="flex items-center">
                    <Link href={`/productos?categoria=${catego.cat.toUpperCase().replace(/[\s/]/g, "")}&tipo=${catego.tipo.toUpperCase().replace(/[\s/]/g, "")}`}
                      className={` text-lg font-medium ${categoria == catego.cat.toUpperCase().replace(/[\s/]/g, "") ? "text-naja " : ""} `}>
                      {catego.cat}
                    </Link>
                    <FaHandPointLeft className={` text-lg font-medium text-orange-300 ml-5 ${categorias[slideIndex].cat.toUpperCase().replace(/[\s/]/g, "") == categoria ? "visible" : "invisible"} `} />
                  </div>

                </li>
              ))}
            </ul>
          </div>

          <div><p className="text-black text-2xl font-bold pt-4 pb-4">Tematicas</p>

          </div>

          <div>
            <div>
              <ul>
                <li className={`block px-1 w-full py-1  hover:bg-red-100  `}>
                  <div className="flex justify-between items-center pl-3">
                    <div>
                      <p className="font-mono"> Todas</p>

                    </div>

                    <RiCheckboxBlankFill onClick={() => filtrarPorSubCategoria("todas")} className={`${subCategoria == "todas" ? "text-pink-300" : "text-white "}  size-5 border-naja bg-naja mr-1 cursor-pointer`} /></div>

                </li>
              </ul>
              <ul>
                {subCategorias.map((categoria, slideIndex) => (
                  <li key={slideIndex} className={`block px-1 w-full py-1  capitalize hover:bg-red-100  `}  >
                    <div className="flex justify-between items-center pl-3"><p className="font-mono">{subCategorias[slideIndex].nombre.toLowerCase()}</p> <RiCheckboxBlankFill onClick={() => filtrarPorSubCategoria(subCategorias[slideIndex].nombre.toLowerCase().replace(/[\s/]/g, ""))} className={`${subCategoria == subCategorias[slideIndex].nombre.toLowerCase().replace(/[\s/]/g, "") ? "text-pink-300" : "text-white "}  size-5 border-naja bg-naja mr-1 cursor-pointer`} /></div>

                  </li>
                ))}
              </ul>
              <ul>
                <li className={`block px-1 w-full py-1  hover:bg-red-100  `}>
                  <div className="flex justify-between items-center pl-4">
                    <div>
                      <p className="font-mono"> Numeros/</p>
                      <p className="font-mono">Chocotortas</p>
                    </div>

                    <RiCheckboxBlankFill onClick={() => filtrarPorSubCategoria("CHOCOTORTAS")} className={`${subCategoria == "CHOCOTORTAS" ? "text-pink-300" : "text-white "}  size-5 border-naja bg-naja mr-1 cursor-pointer`} /></div>

                </li>
                <li className={`block px-1 w-full py-1  hover:bg-red-100  `}>
                  <div className="flex justify-between items-center pl-4">
                    <div>
                      <p className="font-mono"> Despedida de</p>
                      <p className="font-mono">Soltero</p>
                    </div>

                    <RiCheckboxBlankFill onClick={() => filtrarPorSubCategoria("SOLTERO")} className={`${subCategoria == "SOLTERO" ? "text-pink-300" : "text-white "}  size-5 border-naja bg-naja mr-1 cursor-pointer`} /></div>

                </li>

              </ul>
            </div>
          </div>

        </div>

        <div className="bg-amber-50 w-full lg:w-250 lg:h-465 rounded-lg lg:rounded-none lg:rounded-r-lg  ">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 px-3 sm:px-5 pt-5 text-sm sm:text-base">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-amber-200 px-3 py-1 shadow-xs">
              <span className="text-gray-500">Categoría</span>
              <span className="font-semibold capitalize text-cyan-900">{categoria.toLowerCase()}</span>
            </span>
            {categoria == "TORTAS" && (
              <>
                <span className="text-amber-500 font-bold" aria-hidden="true">›</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-amber-200 px-3 py-1 shadow-xs">
                  <span className="text-gray-500">Piso</span>
                  <span className="font-semibold text-cyan-900">{pisoLegible()}</span>
                </span>
              </>
            )}
            <span className="text-amber-500 font-bold" aria-hidden="true">›</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-amber-200 px-3 py-1 shadow-xs">
              <span className="text-gray-500">Temática</span>
              <span className="font-semibold text-cyan-900">{tematicaLegible()}</span>
            </span>
          </div>
          <div className="grid grid-cols-1 min-[680px]:grid-cols-2 lg:grid-cols-3 justify-items-center lg:justify-items-start gap-4 pt-4 px-3 lg:pr-0 lg:pl-4" >
            {errorPiso ? (
              <div className="col-span-full text-center text-xl py-10 text-gray-500">
                No pudimos cargar los productos de este piso por un problema de conexión. Intentá de nuevo en unos minutos.
              </div>
            ) : errorTematica ? (
              <div className="col-span-full text-center text-xl py-10 text-gray-500">
                No pudimos cargar los productos de esta temática por un problema de conexión. Intentá de nuevo en unos minutos.
              </div>
            ) : produ.length === 0 ? (
              <div className="col-span-full text-center text-xl py-10 text-gray-500">
                No hay productos por el momento
              </div>
            ) : (
              produ.map((producto, slideIndex) => (

                <div key={slideIndex} className="w-full flex justify-center lg:block lg:w-auto">
                  <Cards{...produ[slideIndex]}></Cards>
                </div>

              ))
            )}

          </div>

          <div className="px-2 py-6 sm:p-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPaginas}
              onPageChange={handlePageChange}
            />
          </div>

        </div>

      </div>

    </div>
  );
}
