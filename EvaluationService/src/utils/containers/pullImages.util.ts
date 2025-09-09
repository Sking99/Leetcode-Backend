import Docker from 'dockerode';
import { PYTHON_IMAGE } from '../constants';
import logger from '../../config/logger.config';

export async function pullImage(image: string){
    const docker = new Docker();

    return new Promise((res, rej) =>{
        docker.pull(image, (err: Error, stream: NodeJS.ReadStream) => {
            if(err) {
                rej(err);
                return;
            }
            docker.modem.followProgress(
                stream,
                function onFinished(finalErr, output) {
                    if(finalErr) {
                        rej(finalErr);
                        return;
                    }
                    return res(output)
                },
                function onProgress(event) {
                    console.log(event.status);
                }
            );
        })
    })
}

export async function pullAllImages(){
    const images = [PYTHON_IMAGE];
    
    const promises = images.map(image => pullImage(image));

    try {
        await Promise.all(promises);
        logger.info("All images pulled successfully");
    } catch (error) {
        logger.error(`Error pulling the images, ${error}`);
    }
}