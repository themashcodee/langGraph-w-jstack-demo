import React, { memo } from "react"
import { motion } from "framer-motion"
import parse from "html-react-parser"

type Props = {
	html: string
}

export const HTMlRenderer = memo((props: Props) => {
	const { html } = props

	return (
		<motion.div
			className={
				"prose-sm prose-invert prose-a:font-medium prose-a:text-blue-400 prose-a:underline prose-strong:font-semibold prose-ol:list-decimal prose-ul:list-disc prose-p:my-1"
			}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 2 }}
		>
			{parse(html)}
		</motion.div>
	)
})

HTMlRenderer.displayName = "HTMlRenderer"
