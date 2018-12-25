package net.imageveil.app.templates

import kotlinx.html.*

fun HEAD.ogUrl(content: String) {
    OgTag(consumer, "og:url", content).visit{}
}

fun HEAD.ogTitle(content: String) {
    OgTag(consumer, "og:title", content).visit{}
}

fun HEAD.ogDescription(content: String) {
    OgTag(consumer, "og:description", content).visit{}
}

fun HEAD.ogImage(content: String) {
    OgTag(consumer, "og:image", content).visit{}
}

fun HEAD.ogImageWidth(content: Int) {
    OgTag(consumer, "og:image:width", "$content").visit{}
}

fun HEAD.ogImageHeight(content: Int) {
    OgTag(consumer, "og:image:height", "$content").visit{}
}

fun HEAD.ogType(content: String) {
    OgTag(consumer, "og:type", content).visit{}
}

fun HEAD.ogLocale(content: String) {
    OgTag(consumer, "og:locale", content).visit{}
}

class OgTag(consumer: TagConsumer<*>, property: String, content: String) : HTMLTag("meta", consumer, attributesMapOf("content", content, "property", property), inlineTag = false, emptyTag = true)