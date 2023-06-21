import { surpriseMePrompts } from "../constants";
import {saveAs} from 'file-saver';

export function getRandomPrompt(prompt){
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);

    const randomPrompt = surpriseMePrompts[randomIndex];
    if(randomPrompt === prompt){
        return getRandomPrompt(prompt);
    }
    return surpriseMePrompts[randomIndex];
}

export async function downloadImage(_id, photo) {
    saveAs(photo, `download-${_id}.jpg`);
}