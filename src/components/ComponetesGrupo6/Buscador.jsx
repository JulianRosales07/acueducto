import Button from "./Button";

const Buscador = () => {
    return (
        <>
            <div className="flex flex-row gap-2 w-full mb-4 ">
                <input
                    type="text"
                    placeholder="Ej: 1234567890 o MAT-2020-1001"
                
                    className="w-full h-12 px-4 text-sm text-gray-700 border border-blue-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <Button/>
            </div>

           
            
        </>

    );

}

export default Buscador;