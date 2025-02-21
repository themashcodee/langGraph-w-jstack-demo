import { MessageContent } from "@langchain/core/messages"
import { HTMlRenderer } from "./html_renderer"

interface MessageContentRendererProps {
	content: MessageContent
}

export const MessageContentRenderer = ({
	content,
}: MessageContentRendererProps) => {
	if (typeof content === "string") return <HTMlRenderer html={content} />

	if (Array.isArray(content)) {
		return (
			<div className="flex flex-col gap-4">
				{content.map((item, index) => {
					if (item.type === "text")
						return <HTMlRenderer key={index} html={item.text} />

					if (item.type === "image_url") {
						const imageUrl =
							typeof item.image_url === "string"
								? item.image_url
								: item.image_url.url
						return (
							<div key={index} className="rounded-lg overflow-hidden">
								<img
									src={imageUrl}
									alt="Content"
									className="w-full h-auto object-cover"
								/>
							</div>
						)
					}

					return (
						<div
							key={index}
							className="text-zinc-400/60 italic leading-relaxed"
						>
							[Unsupported content type]
						</div>
					)
				})}
			</div>
		)
	}

	return <HTMlRenderer html="[Unknown content format]" />
}
