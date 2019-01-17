package net.imageveil.app.filters

import javax.servlet.*
import javax.servlet.annotation.WebFilter

@WebFilter(
        filterName = "EncodingFilter",
        urlPatterns = [ "*" ]
)
class Encoding : Filter {
    override fun init(filterConfig: FilterConfig) {}
    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        response.characterEncoding = "utf-8"
        chain.doFilter(request, response)
    }
    override fun destroy() {}
}