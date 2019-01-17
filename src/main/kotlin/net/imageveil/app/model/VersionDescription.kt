package net.imageveil.app.model

import java.util.*

data class VersionDescription(
        val id: String,
        val releaseDate: Date,
        val simple: String,
        val details: Details
) {
    data class Details(
            val fix: ArrayList<String>,
            val feat: ArrayList<String>,
            val chore: ArrayList<String>
    )
}