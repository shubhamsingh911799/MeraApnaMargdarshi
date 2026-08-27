const dotenv = require("dotenv");

dotenv.config();


const app =
require("./app");


const connectDB =
require("./config/db");


const config =
require("./config/config");



const startServer = async () => {

  try {


    await connectDB();



    const server =
      app.listen(
        config.port,
        () => {

          console.log(
            `Server running on port ${config.port}`
          );

        }
      );




    // Graceful Shutdown

    process.on(
      "SIGTERM",
      () => {


        console.log(
          "SIGTERM received. Closing server..."
        );


        server.close(() => {


          mongoose.connection.close(
            false,
            () => {

              process.exit(0);

            }
          );


        });


      }
    );



  } catch(error){


    console.error(
      "Server startup failed:",
      error.message
    );


    process.exit(1);

  }

};



startServer();