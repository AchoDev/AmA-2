<template>

    <div 
        id="drawing-area" 
        :style="{width: width, height: height}"
    >  
        {{ width }} x {{ height }}
        touching: {{ touching }}

        current tool: {{ currentTool }}

        <svg>
            <path
                v-for="path in paths"
                :d="path.path.map((p, index) => (index === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ')"
                fill="none"
                :stroke="path.color"
                stroke-width="2"
            />
            <path
                :d="currentPath.path.map((p, index) => (index === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ')"
                fill="none"
                :stroke="currentColor"
                stroke-width="2"
            />
        </svg>

        <div id="tool-bar">

            <button @click="currentTool = 'pen'" :class="currentTool == 'pen' ? 'active' : ''">
                <img src="../assets/pen.svg" alt="">
            </button>
            <button @click="currentTool = 'eraser'" :class="currentTool == 'eraser' ? 'active' : ''">
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

defineProps<{
    width: string,
    height: string
}>()

const touching = ref(false)

const currentColor = ref('black')
const currentTool = ref('pen');

const eraserSize = ref(10)
const eraserPosition = ref({x: 0, y: 0})

const colors = ref(['black', 'red', 'blue', 'green'])

interface Point {
    x: number,
    y: number
}

interface Path {
    path: Array<Point>,
    color: string
}

const paths = ref< Array<Path> >([])
const currentPath = ref<Path>({path: [], color: currentColor.value})

function catmullRomSpline(P0: { x: number; y: number; }, P1: { x: number; y: number; }, P2: { x: number; y: number; }, P3: { x: number; y: number; }, t: number) {
    const t2 = t * t;
    const t3 = t2 * t;
    return {
        x: 0.5 * ((2 * P1.x) + (-P0.x + P2.x) * t + (2*P0.x - 5*P1.x + 4*P2.x - P3.x) * t2 + (-P0.x + 3*P1.x- 3*P2.x + P3.x) * t3),
        y: 0.5 * ((2 * P1.y) + (-P0.y + P2.y) * t + (2*P0.y - 5*P1.y + 4*P2.y - P3.y) * t2 + (-P0.y + 3*P1.y- 3*P2.y + P3.y) * t3)
    };
}

function generateCurve(points: string | any[], numPoints = 100) {

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

    const drawingArea = document.getElementById('drawing-area')!

    function evaluatePoint(x: number, y: number) {
        return {x: x - drawingArea.offsetLeft, y: y - drawingArea.offsetTop}
    }

    const setEraserPos = (x: number, y: number) => {
        eraserPosition.value = {x: x - eraserSize.value / 2 - drawingArea.offsetLeft, y: y - eraserSize.value / 2- drawingArea.offsetTop}
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
        
        const touchX = e.touches[0].clientX
        const touchY = e.touches[0].clientY

        if(currentTool.value === 'eraser') {

            setEraserPos(touchX, touchY)

            console.log(paths.value)

            paths.value.forEach(element => {
                let pointFound = false
                let newPath: Array<Point> = []
                element.path.forEach(point => {

                    
                    // let newPath

                    if(pointFound) {
                        element.path = element.path.filter(p => p !== point)
                        newPath.push(point)

                        return
                    }
                    
                    if(point.x > touchX - drawingArea.offsetLeft - eraserSize.value / 2 && point.x < touchX - drawingArea.offsetLeft + eraserSize.value / 2
                    && point.y > touchY - drawingArea.offsetTop - eraserSize.value / 2 && point.y < touchY - drawingArea.offsetTop + eraserSize.value / 2) {
                        
                        
                        if(element.path[0] === point || element.path[element.path.length - 1] === point) {
                            console.log('found start or end')
                            element.path = element.path.filter(p => p !== point)

                            if(element.path.length === 0) {
                                paths.value = paths.value.filter(p => p !== element)
                            }

                            return
                        }

                        element.path = element.path.filter(p => p !== point)
                        
                        pointFound = true
                    }
                })

                if(pointFound) {
                    paths.value.push({path: newPath, color: element.color})
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
            currentPath.value = {path: [], color: currentColor.value}
            return
        }

        paths.value.push({
            path: simplify(generateCurve(currentPath.value.path), 1),
            color: currentColor.value
        })
        currentPath.value = {path: [], color: currentColor.value}
        console.log(paths.value)
    })
})

</script>

<style scoped lang="scss">

#drawing-area {
    overflow: hidden;
    border: 1px solid black;
    position: relative;

    svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
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

    width: 400px;
    margin: 10px 0;
    padding: 10px;

    overflow: hidden;
    height: 50px;

    // pointer-events: none;

    // & > * {
    //     pointer-events: all;
    // }

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

    #eraser-size {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: auto;

        flex-direction: row;

        width: 90%;


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