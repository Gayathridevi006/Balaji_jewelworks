'use client';
import {Share2} from 'lucide-react';
export default function ShareButton({url,title}:{url:string;title:string}){return <button className="btn btn-light" style={{width:'100%',marginTop:10}} onClick={async()=>{if(navigator.share){try{await navigator.share({title,text:`Have a look at ${title}`,url})}catch{}}else{window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,'_blank')}}}><Share2 size={16}/> Share design</button>}
