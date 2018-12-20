package net.imageveil.app.templates

import kotlinx.html.*

fun HEAD.ogUrl(content: String, block: OgTag.() -> Unit = {}) {
    OgTag(consumer, "og:url", content).visit(block)
}

fun HEAD.ogTitle(content: String, block: OgTag.() -> Unit = {}) {
    OgTag(consumer, "og:title", content).visit(block)
}

fun HEAD.ogDescription(content: String, block: OgTag.() -> Unit = {}) {
    OgTag(consumer, "og:description", content).visit(block)
}

fun HEAD.ogImage(content: String, block: OgTag.() -> Unit = {}) {
    OgTag(consumer, "og:image", content).visit(block)
}

fun HEAD.ogImageWidth(content: Int, block: OgTag.() -> Unit = {}) {
    OgTag(consumer, "og:image:width", "$content").visit(block)
}

fun HEAD.ogImageHeight(content: Int, block: OgTag.() -> Unit = {}) {
    OgTag(consumer, "og:image:height", "$content").visit(block)
}

fun HEAD.ogType(content: String, block: OgTag.() -> Unit = {}) {
    OgTag(consumer, "og:type", content).visit(block)
}

fun HEAD.ogLocale(content: String, block: OgTag.() -> Unit = {}) {
    OgTag(consumer, "og:locale", content).visit(block)
}

class OgTag(consumer: TagConsumer<*>, property: String, content: String) : HTMLTag("meta", consumer, attributesMapOf("content", content, "property", property), inlineTag = false, emptyTag = true)