package com.connectverse.connectverse.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping("/{path:[^\\.]*}") // Match all paths except those with a dot (e.g., static files)
    public String forwardToFrontend() {
        return "forward:/index.html";
    }
}