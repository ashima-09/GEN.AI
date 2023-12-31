import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import { FormField, Loader } from '../components'

// const fs=require('fs');
// function blobToJson(blob) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
    
//     reader.onload = () => {
//       try {
//         const jsonData = JSON.parse(reader.result);
//         resolve(jsonData);
//       } catch (error) {
//         alert(error);
//         reject(error);
//       }
//     };
    
//     reader.onerror = (error) => {
//       reject(error);
//     };
    
//     reader.readAsText(blob);
//   });
// }




const CreatePost = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        prompt: '',
        photo: '',
    });
    const [img, setImg] = useState(null); 
    const [generatingImg, setGeneratingImg] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.prompt && form.photo) {
            setLoading(true);
        try {
                const formData = new FormData();
                formData.append('name', form.name);
                formData.append('prompt', form.prompt);
                formData.append('photo', img);
                console.log(img)
                const response = await fetch('https://ai-gen-backend.onrender.com/api/v1/post', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    navigate('/');
                } else {
                    throw new Error('HTTP request failed');
                }
            } catch (error) {
                alert(error);
            } finally {
                setLoading(false);
            }
        }
        else {
            alert("Please generate image with proper details");
        }
    };
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({ ...form, prompt: randomPrompt })
    }

    const generateImage = async () => {
        if (form.prompt) {
            // console.log(form.prompt);
            try {
                setGeneratingImg(true);

                const response = await fetch(
                    "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
                    {
                        headers: { Authorization: "Bearer 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" },
                        method: "POST",
                        body: JSON.stringify(form.prompt),
                    }
                );
                const data = await response.blob();

                const imgurl = URL.createObjectURL(data);
                // setForm({ ...form, photo: `${imgurl}` });
                setForm({ ...form, photo: imgurl});
                setImg(data);
                console.log(form);
            } catch (error) {
                alert(error);
            } finally {
                setGeneratingImg(false);
            }
        }
        else {
            alert('Please enter a prompt');
        }
    }

    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
                <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an imaginative image and share it with the community</p>
            </div>

            <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <FormField
                        labelName="Your Name"
                        type="text"
                        name="name"
                        placeholder="Ex., john doe"
                        value={form.name}
                        handleChange={handleChange}
                    />

                    <FormField
                        labelName="Prompt"
                        type="text"
                        name="prompt"
                        placeholder="Ex., A futuristic cyborg dance club, neon lights"
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />

                    <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
                        {form.photo ? (
                            <img
                                src={form.photo}
                                alt={form.prompt}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-9/12 h-9/12 object-contain opacity-40"
                            />
                        )}

                        {generatingImg && (
                            <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                                <Loader />
                            </div>
                        )}
                    </div>

                </div>

                <div className="mt-5 flex gap-5">
                    <button
                        type="button"
                        onClick={generateImage}
                        className=" text-white bg-[#1E2022] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        {generatingImg ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                <div className="mt-10">
                    <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
                    <button
                        type="submit"
                        className="mt-3 bg-[#fc7ea6] text-[#ffffff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        {loading ? 'Sharing...' : 'Share with the Community'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default CreatePost
