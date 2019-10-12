import 'dotenv';
import distance =  require('google-distance-matrix');

distance.key(process.env.GOOGLE_MAPS_API);
