import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import HttpStatus from 'http-status-codes';
import fetch from 'node-fetch';
import * as fs from 'fs';

require('dotenv').config();

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{URL}}");
  } );

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    let { image_url } = req.query;
    if (!image_url) {
      return res.status(HttpStatus.BAD_REQUEST).send('You need to provide the image_url query parameter.');
    }

    try {
      const fetchRes = await fetch(image_url, {method: 'HEAD'});
      if (!fetchRes.ok) {
        throw 'Fetching image_url failed.';
      }
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).send('The image url could not be found. Error: ' + error);
    }

    const filteredImageFilepath = await filterImageFromURL(image_url);
    const filteredImageFileContent = fs.readFileSync(filteredImageFilepath);

    deleteLocalFiles([filteredImageFilepath]);

    res.status(HttpStatus.OK).set('Content-Disposition', 'inline').set('Content-type', 'image/jpeg').send(filteredImageFileContent);
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();