import './login.scss';
 const login = () => {
   return (
     <div className="login h-screen bg-purple-300 flex items-center justify-center">
       <div className="card w-1/2 flex bg-white rounded-2xl min-h-3/4 overflow-hidden">
         <div className="left flex-1 bg-gradient-to-r from-purple-600 to-purple-400 bg-cover bg-center p-10 flex flex-col gap-4 text-white">
           <h1 className="text-6xl leading-6">Hello World.</h1>
           <p>
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
             cum, alias totam numquam ipsa exercitationem dignissimos, error
             nam, consequatur.
           </p>
           <span className="text-sm">Don't you have an account?</span>
           {/* <Link to="/register"> */}
             <button className="w-1/2 py-2 bg-white text-purple-600 font-bold cursor-pointer">
               Register
             </button>
           {/* </Link> */}
         </div>
         <div className="right flex-1 p-10 flex flex-col gap-4 justify-center">
           <h1 className="text-gray-700">Login</h1>
           <form className="flex flex-col gap-4">
             <input
               type="text"
               placeholder="Username"
               className="border-none border-b-2 border-light-gray py-2"
             />
             <input
               type="password"
               placeholder="Password"
               className="border-none border-b-2 border-light-gray py-2"
             />
             <button
            //    onClick={handleLogin}
               className="w-1/2 py-2 bg-purple-600 text-white font-bold cursor-pointer"
             >
               Login
             </button>
           </form>
         </div>
       </div>
     </div>
   );
 };
export default login