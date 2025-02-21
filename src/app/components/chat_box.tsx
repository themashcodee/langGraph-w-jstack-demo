"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { client } from "@/lib/client"
import toast from "react-hot-toast"
import { MessageContent } from "@langchain/core/messages"
import { MessageContentRenderer } from "./message_content_renderer"

export const ChatBox = () => {
	const [message, setMessage] = useState<string>("")
	const [content, setContent] = useState<MessageContent | null>(null)

	const { mutate: send_message, isPending } = useMutation({
		mutationFn: async ({ message }: { message: string }) => {
			const res = await client.chat.message.$post({ message })
			return await res.json()
		},
		onSuccess: async (data) => {
			setMessage("")
			setContent(data.response)
			console.log({ response: data.response })
		},
		onError: (error) => {
			console.log(error)
			toast.error("An error occurred while sending the message")
		},
	})

	const handleSubmit = () => {
		if (!message) return toast.error("Please enter a message")
		send_message({ message })
	}

	return (
		<div className="w-full max-w-3xl backdrop-blur-xl bg-black/20 px-8 py-8 rounded-lg border border-zinc-800/40 shadow-lg text-zinc-100/90 flex flex-col gap-6">
			<p className="text-zinc-300/80 leading-relaxed">
				I can help you manage employee data, including adding new employees,
				removing employees, updating employee information, and retrieving
				employee details.
			</p>

			<form
				onSubmit={(e) => {
					e.preventDefault()
					handleSubmit()
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault()
						handleSubmit()
					}
				}}
				className="flex flex-col gap-4"
			>
				<textarea
					placeholder="e.g. What's the average salary of employees in the marketing department?"
					value={message}
					rows={3}
					onChange={(e) => setMessage(e.target.value)}
					className="w-full text-base/6 rounded-lg bg-black/40 hover:bg-black/50 focus-visible:outline-none ring-1 ring-zinc-700/50 hover:ring-zinc-600 focus:ring-zinc-500 focus:bg-black/50 transition px-4 py-3 text-zinc-100 resize-none"
				/>
				<button
					disabled={isPending}
					type="submit"
					className="self-end rounded-lg text-base/6 ring-2 ring-offset-2 ring-offset-black/80 focus-visible:outline-none focus-visible:ring-emerald-500 ring-transparent hover:ring-emerald-500 px-8 py-2.5 bg-emerald-500 text-zinc-900 font-medium transition hover:bg-emerald-400 disabled:opacity-70 disabled:cursor-not-allowed"
				>
					{isPending ? "Thinking..." : "Ask Assistant"}
				</button>
			</form>

			{content && (
				<div className="flex flex-col gap-10 pt-4">
					<div className="w-full h-[1px] bg-zinc-800"></div>
					<MessageContentRenderer content={content} />
				</div>
			)}
		</div>
	)
}
