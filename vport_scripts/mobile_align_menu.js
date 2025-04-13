import { routeHandler } from "./mobile_main"

export function mobileAlignMenu() {
    const topBottom1 = document.querySelector("#mobile-top-bottom-1")
    const topBottom2 = document.querySelector("#mobile-top-bottom-2")
    const topBottom3 = document.querySelector("#mobile-top-bottom-3")
    const bottomTop1 = document.querySelector("#mobile-bottom-top-1")
    const bottomTop2 = document.querySelector("#mobile-bottom-top-2")
    const bottomTop3 = document.querySelector("#mobile-bottom-top-3")
    const leftRight1 = document.querySelector("#mobile-left-right-1")
    const leftRight2 = document.querySelector("#mobile-left-right-2")
    const leftRight3 = document.querySelector("#mobile-left-right-3")
    const rightLeft1 = document.querySelector("#mobile-right-left-1")
    const rightLeft2 = document.querySelector("#mobile-right-left-2")
    const rightLeft3 = document.querySelector("#mobile-right-left-3")

    topBottom1.addEventListener("click", () => {
        const btn = document.querySelector("#top_bottom_1")
        btn.click()
        routeHandler({category: "align"})
    })

    topBottom2.addEventListener("click", () => {
        const btn = document.querySelector("#top_bottom_2")
        btn.click()
        routeHandler({category: "align"})
    })

    topBottom3.addEventListener("click", () => {
        const btn = document.querySelector("#top_bottom_3")
        btn.click()
        routeHandler({category: "align"})
    })

    bottomTop1.addEventListener("click", () => {
        const btn = document.querySelector("#bottom_top_1")
        btn.click()
        routeHandler({category: "align"})
    })

    bottomTop2.addEventListener("click", () => {
        const btn = document.querySelector("#bottom_top_2")
        btn.click()
        routeHandler({category: "align"})
    })

    bottomTop3.addEventListener("click", () => {
        const btn = document.querySelector("#bottom_top_3")
        btn.click()
        routeHandler({category: "align"})
    })

    leftRight1.addEventListener("click", () => {
        const btn = document.querySelector("#left_right_1")
        btn.click()
        routeHandler({category: "align"})
    })

    leftRight2.addEventListener("click", () => {
        const btn = document.querySelector("#left_right_2")
        btn.click()
        routeHandler({category: "align"})
    })

    leftRight3.addEventListener("click", () => {
        const btn = document.querySelector("#left_right_3")
        btn.click()
        routeHandler({category: "align"})
    })

    rightLeft1.addEventListener("click", () => {
        const btn = document.querySelector("#right_left_1")
        btn.click()
        routeHandler({category: "align"})
    })

    rightLeft2.addEventListener("click", () => {
        const btn = document.querySelector("#right_left_2")
        btn.click()
        routeHandler({category: "align"})
    })

    rightLeft3.addEventListener("click", () => {
        const btn = document.querySelector("#right_left_3")
        btn.click()
        routeHandler({category: "align"})
    })
}
