import { Search } from "lucide-react";


const Buscador = ({ placeholder, onChange }) => {
    return (
        <div 
            className="flex items-center w-2xl h-12  px-4 text-sm text-gray-700 border border-blue-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
            <button
                
                className="flex items-center justify-center"
                >
                <Search className="w-5 h-12 text-blue-600 hover:cursor-pointer" />
            
            </button>
            <input
                type="text"
                placeholder={placeholder}
                onChange={onChange}
                className=" h-12 px-4 text-sm text-gray-700 w-full border-none  placeholder:text-gray-400 focus:outline-none focus:ring-0"
            />

        </div>

    );

}

export default Buscador;