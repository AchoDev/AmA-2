<template>

    <div 
        id="drawing-area" 
        :style="{width: width, height: height}"
    >  
        {{ width }} x {{ height }}
        touching: {{ touching }}

        current tool: {{ currentTool }}

        <svg :style="`transform: translateY(${currentScrollY}px)`">
            <path
                v-for="path in paths"
                :d="path.path.map((p, index) => (index === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ')"
                fill="none"
                :stroke="path.color"
                :stroke-width="path.width"
                stroke-linecap="round"
            />
            <path
                :d="currentPath.path.map((p, index) => (index === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ')"
                fill="none"
                :stroke="currentColor"
                :stroke-width="penSize"
                stroke-linecap="round"
            />
        </svg>

        <div id="tool-bar" :class="(toolBarMinimized ? 'minimized' : '') + (toolbarFixed ? 'fixed-toolbar' : '')">

            <button @click="currentTool = toolBarMinimized ? 'eraser' : 'pen'" :class="currentTool == 'pen' ? 'active' : ''">
                <img src="../assets/pen.svg" alt="">
            </button>
            <button @click="currentTool = toolBarMinimized ? 'pen' : 'eraser'" :class="currentTool == 'eraser' ? 'active' : ''">
                <img src="../assets/eraser.svg" alt="">
            </button>

            <div class="divider">
                &nbsp;
            </div>

            <div v-show="currentTool == 'pen'" id="color-picker">
                <button 
                    v-for="color in colors" 
                    @click="currentColor = color" 
                    :class="currentColor == color ? 'selected' : ''"
                    :style="`background:${color}`"
                >
                &nbsp;
                </button>
            </div>

            <button id="minimizer" @click="toolBarMinimized = !toolBarMinimized">
                >>
            </button>

            <div v-show="currentTool == 'eraser'" id="eraser-size">
                <input type="range" min="10" max="100" v-model="eraserSize" />
                
                <div id="repr-wrapper">
                    <div id="repr" 
                        :style="`width: ${eraserSize}px; height: ${eraserSize}px;`"
                    >
                        {{ eraserSize >= 25 ? eraserSize : '' }}
                    </div>
                </div>
            </div>

            <div v-show="currentTool == 'pen'" id="pen-size">
                <input type="range" min="1" max="20" v-model="penSize" @click.stop id="pen-size-range"/>
                
                <div id="pen-repr-wrapper">
                    <div id="repr" 
                        :style="`width: ${penSize}px; height: ${penSize}px;`"
                    >
                    &nbsp;
                    </div>
                </div>

                <span>{{ penSize }}</span>

                <!-- <input
                    id="pen-size-show"
                    type="number"
                    inputmode="numeric"
                    v-model="penSize"
                    min="1"
                    max="20"
                /> -->
            </div>


            <!-- slider -->
            <!-- <input type="range" min="5" max="100" v-model="eraserSize" /> -->
        </div>

        <div 
            id="eraser" 
            v-show="currentTool === 'eraser' && touching"
            :style="`top: ${eraserPosition.y}px; left: ${eraserPosition.x}px; width: ${eraserSize}px; height: ${eraserSize}px`"
            
        >
            &nbsp;
        </div>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Path from './path';

interface Point {
    x: number,
    y: number
}

defineProps<{
    width: string,
    height: string,
    toolbarFixed: boolean
}>()

const touching = ref(false)

const currentColor = ref('black')
const currentTool = ref('pen');

const penSize = ref(5)
const eraserSize = ref(10)
const eraserPosition = ref({x: 0, y: 0})

const colors = ref(['black', 'red', 'blue', 'green'])

const toolBarMinimized = ref(false)

const currentScrollY = ref(0)

const paths = defineModel<Array<Path>>()
paths.value = [
    {
        path: [{x: 100, y: 100}, {x: 200, y: 200}],
        color: 'black',
        width: 5
    }
]
const currentPath = ref<Path>({path: [], color: currentColor.value, width: penSize.value})

function catmullRomSpline(P0: { x: number; y: number; }, P1: { x: number; y: number; }, P2: { x: number; y: number; }, P3: { x: number; y: number; }, t: number) {
    const t2 = t * t;
    const t3 = t2 * t;
    return {
        x: 0.5 * ((2 * P1.x) + (-P0.x + P2.x) * t + (2*P0.x - 5*P1.x + 4*P2.x - P3.x) * t2 + (-P0.x + 3*P1.x- 3*P2.x + P3.x) * t3),
        y: 0.5 * ((2 * P1.y) + (-P0.y + P2.y) * t + (2*P0.y - 5*P1.y + 4*P2.y - P3.y) * t2 + (-P0.y + 3*P1.y- 3*P2.y + P3.y) * t3)
    };
}

function generateCurve(points: string | any[], numPoints = 1000) {

    points = [points[0], ...points, points[points.length - 1]]
    const curve = [];
    for (let i = 0; i < points.length - 3; i++) {
        for (let t = 0; t < numPoints; t++) {
        const point = catmullRomSpline(points[i], points[i + 1], points[i + 2], points[i + 3], t / numPoints);
        curve.push(point);
        }
    }

    return curve;
}

function distanceFromPointToLine(point: { x: number; y: number; }, lineStart: { x: number; y: number; }, lineEnd: { x: number; y: number; }) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (dx * dx + dy * dy);
  const closestPoint = t < 0 ? lineStart : t > 1 ? lineEnd : {x: lineStart.x + t * dx, y: lineStart.y + t * dy};
  return Math.sqrt(Math.pow(closestPoint.x - point.x, 2) + Math.pow(closestPoint.y - point.y, 2));
}

function simplify(points: any[], epsilon: number): Array<Point> {
    if (points.length <= 2) return points;
    const end = points.length - 1;
    let index = -1;
    let dist = 0;
    for (let i = 1; i < end; i++) {
        const d = distanceFromPointToLine(points[i], points[0], points[end]);
        if (d > dist) {
        index = i;
        dist = d;
        }
    }
    if (dist > epsilon) {
        const left = simplify(points.slice(0, index + 1), epsilon);
        const right = simplify(points.slice(index), epsilon);
        return left.slice(0, left.length - 1).concat(right);
    } else {
        return [points[0], points[end]];
    }
}


onMounted(() => {

    document.getElementById("pen-size-range")?.addEventListener('change', (e) => {
        e.stopPropagation()
    })

    const drawingArea = document.getElementById('drawing-area')!

    function evaluatePoint(x: number, y: number) {
        const absPos = drawingArea.getBoundingClientRect()
        return {x: x - absPos.left, y: y - absPos.top}
    }

    const setEraserPos = (x: number, y: number) => {
        const absPos = drawingArea.getBoundingClientRect()
        eraserPosition.value = {x: x - eraserSize.value / 2 - absPos.left, y: y - eraserSize.value / 2- absPos.top}
    }

    document.querySelector('#tool-bar')?.addEventListener('touchstart', (e) => {
        e.stopPropagation()
    })

    drawingArea.addEventListener('touchstart', (e) => {

        touching.value = true
        setEraserPos(e.targetTouches[0].clientX, e.touches[0].clientY)

        if(currentTool.value === 'eraser') {
            return
        }

        currentPath.value.path.push(evaluatePoint(e.touches[0].clientX, e.touches[0].clientY))
    })  
    
    drawingArea.addEventListener('touchmove', (e) => {

        if(e.touches.length > 1) {
            currentScrollY.value += e.touches[0].clientY
            return
        }
        
        // TODO fix eraser glitching below 320px for some reason

        if(!touching.value) {
            return
        }

        const touchX = e.touches[0].clientX
        const touchY = e.touches[0].clientY

        if(currentTool.value === 'eraser') {

            setEraserPos(touchX, touchY)

            paths.value!.forEach(element => {
                let pointFound = false
                let newPath: Array<Point> = []
                element.path.forEach(point => {

                    // let newPath

                    if(pointFound) {
                        element.path = element.path.filter(p => p !== point)
                        newPath.push(point)

                        return
                    }
                    
                    const absPos = drawingArea.getBoundingClientRect()

                    if(point.x > touchX - absPos.left - eraserSize.value / 2 && point.x < touchX - absPos.left + eraserSize.value / 2
                    && point.y > touchY - absPos.top - eraserSize.value / 2 && point.y < touchY - absPos.top + eraserSize.value / 2) {
                        
                        
                        if(element.path[0] === point || element.path[element.path.length - 1] === point) {
                            element.path = element.path.filter(p => p !== point)

                            if(element.path.length === 0) {
                                paths.value = paths.value!.filter(p => p !== element)
                            }

                            return
                        }

                        element.path = element.path.filter(p => p !== point)
                        
                        pointFound = true
                    }
                })

                if(pointFound) {
                    paths.value!.push({path: newPath, color: element.color, width: element.width})
                }
            })

            return
        }

        currentPath.value.path.push(evaluatePoint(touchX, touchY))
    })

    drawingArea.addEventListener('touchend', () => {

        if(!touching.value) {
            return
        }

        touching.value = false

        if(currentTool.value === 'eraser') {
            return
        }

        if(currentPath.value.path.length < 2) {
            currentPath.value = {path: [], color: currentColor.value, width: penSize.value}
            return
        }

        paths.value!.push({
            // path: simplify(generateCurve(currentPath.value.path), 0.1),
            path: simplify(generateCurve(simplify(currentPath.value.path, 1)), 0.1),
            color: currentColor.value,
            width: penSize.value
        })
        currentPath.value = {path: [], color: currentColor.value, width: penSize.value}
    })
})

</script>

<style scoped lang="scss">

#drawing-area {
    overflow: hidden;
    // border: 1px solid black;
    position: relative;
    background: white;

    border-radius: 10px;

    svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // background: white;
    }

    // transform: scale(1.5);
}

#tool-bar {
    position: absolute;
    bottom: 0;
    right: 50%;
    transform: translateX(50%);

    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    // background: gray;
    border-radius: 100px;

    display: flex;
    align-items: center;
    z-index: 10;

    background: white;

    width: 550px;
    margin: 10px 0;
    padding: 10px;


    height: 50px;

    // pointer-events: none;

    // & > * {
    //     pointer-events: all;
    // }

    transition: ease-out .2s;

    &.minimized {

        overflow: hidden;

        width: 100px;

        right: 0;
        margin: 10px;
        transform: none;

        display: flex;
        flex-direction: row;
        justify-content: left;

        button {
            opacity: 0;
            pointer-events: none;
            // position: absolute;
        }
        button.active {
            opacity: 1;
            position: absolute;
            pointer-events: all;
            left: 10px;

        }

        #eraser-size {
            opacity: 0;
            pointer-events: none;
            // position: absolute;
        }

        #pen-size {
            opacity: 0;
            pointer-events: none;
            // position: absolute;
        }

        #minimizer {
            opacity: 1;
            pointer-events: all;
            right: 5px;
            transform: rotate(180deg);
        }

        .divider {
            opacity: 0;
            // position: absolute;
        }

        #color-picker {
            opacity: 0;
            pointer-events: none;
            // position: absolute;
        }
    }

    &.fixed-toolbar {
        position: fixed;
        bottom: 10px;
        right: 50%;
        transform: translateX(50%);
    }

    button {

        
        width: 40px;
        height: 40px;
        background: rgb(255, 255, 255);
        border: none;
        border-radius: 100%;
        margin: 5px;
        box-shadow: rgba(0, 0, 0, 0.089) 0px 0px 5px;

        transition: ease-out .05s;

        flex-shrink: 0;
            
        display: grid;
        place-items: center;

        img {
            transition: ease-out .2s;
            width: 80%;
            height: 80%;
        }

    }

    .divider {
        width: 1px;
        background: rgb(224, 224, 224);
        margin: 0 10px;
        height: 40px;
    }

    #color-picker {
        display: flex;
        justify-content: center;
        width: 100%;

        transition: ease .3s;
        
        button {
            height: 30px;
            width: 30px;
            transition: ease-out .2s;

            margin: 0 10px;
            border: 0px solid white;

            &.selected {
                border: 5px solid rgb(180, 180, 180);
                transform: scale(1.5)
            }
        }
    }

    #minimizer {
        transition: ease-out .1s;
        position: absolute;
        right: -50px;
        box-shadow: rgba(0, 0, 0, 0.664) 0px 0px 8px;
    }

    #pen-size {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: auto;

        flex-direction: row;
        transition: linear .2s;

        width: 90%;

        #pen-repr-wrapper {
                
                width: 50px;
                display: grid;
                place-items: center;
    
                #repr {
                    width: 50px;
                    height: 50px;
                    // border: 1px solid black;
                    border-radius: 100%;
                    background: rgb(0, 0, 0);
                    // border: 1px solid black;
                    display: grid;
                    place-items: center;
                }
        }

        span {
            font-size: 13pt;
        }
    }

    #eraser-size {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: auto;

        flex-direction: row;

        width: 90%;
        height: 70px;
        overflow: hidden;


        #repr-wrapper {

            width: 100px;
            display: grid;
            place-items: center;

            #repr {
                width: 50px;
                height: 50px;
                // border: 1px solid black;
                border-radius: 100%;
                background: rgb(243, 243, 243);
                border: 1px solid black;
                display: grid;
                place-items: center;
            }
        }

    }

    .active {
        background: rgb(255, 149, 29);
        transform: scale(1.3);

        img {
            transform: scale(1.4);
        }
    }
}

#eraser {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgb(243, 243, 243);
    border: 1px solid black;
    z-index: 9;
    border-radius: 100%;
}

</style>