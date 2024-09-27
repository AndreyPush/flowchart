<script setup lang="ts">
import VueMermaidString from 'vue-mermaid-string';
import endent from 'endent';
import {computed} from 'vue'

const type = 'flowchart LR';

const styles = []

const actionStyle = "fill:#facc43,stroke:#333,stroke-width:4px";
const filterStyle = "fill:#2abdff,stroke:#333,stroke-width:4px"

const nodes = [
    {
        id: "11",
        text: "Дата рождения",
        link: "---",
        next: ["22", "33", "44", "55"],
        edgeType: "rhombus",
        style: actionStyle,
    },
    {
        id: "22",
        text: "Был в кедах?",
        edgeType: "round",
        next: ["66"],
        style: filterStyle,
    },
    {
        id: "33",
        text: "Ездил на велосипеде?",
        next: ["66"],
        edgeType: "round",
        style: filterStyle,
    },
    {
        id: "44",
        text: "Носил футболку?",
        next: ["66"],
        edgeType: "round",
        style: filterStyle,
    },
    {
        id: "55",
        text: "Кепка была желтой?",
        edgeType: "round",
        next: ["66"],
        style: filterStyle,
    },
    {
        id: "66",
        text: "Дать купон на окрошку",
        edgeType: "rhombus",
        style: actionStyle,
    }
]

const nodeObject = computed(() => {
    if (Array.isArray(nodes) && nodes.length > 0) {
        const arrayToObject = (arr, keyField) =>
            Object.assign({}, ...arr.map((item) => ({ [item[keyField]]: item })))
        return arrayToObject(nodes, 'id')
    } else {
        return {}
    }
});

const customStyle = computed(() => {
    const nodeStyles = nodes
        .filter((node) => node.style)
        .map((node) => `style ${node.id} ${node.style}`)
    let index = 0
    const nodeLinkStyles = nodes
        .filter((node) => node.linkStyle)
        .map(
            (node) => {
                let linkNumber = (node.linkNumber || node.linkNumber == '0' ? node.linkNumber : index)
                index++
                return `linkStyle ${linkNumber} ${node.linkStyle}`
            })
    return nodeStyles.concat(styles).concat(nodeLinkStyles)
});

const parseCode = computed(() => {
    if (Array.isArray(nodes) && nodes.length > 0) {
        const parseCode = type + '\n'
        const groupNodes = getGroupNodes(nodes)
        const code = parseCode + groupNodes + customStyle.value.join(' \n')
        return code
    } else {
        return ''
    }
})

const edges = [
    { type: 'default', open: '[', close: ']' },
    { type: 'round', open: '(', close: ')' },
    { type: 'circle', open: '((', close: '))' },
    { type: 'asymetric', open: '>', close: ']' },
    { type: 'rhombus', open: '{', close: '}' },
];

function getGroupNodes(nodes) {
    const innerMap = new Map()
    nodes.forEach((element) => {
        const group = element.group || ''
        const data = innerMap.get(group) || { nids: new Set(), narr: [] }
        data.nids.add(element.id)
        data.narr.push(element)
        innerMap.set(group, data)
    })
    return [...innerMap.entries()]
        .map((item) => {
            const [groupName, entry] = item
            const { nids, narr } = entry
            if (groupName !== '') {
                const innerNodes = []
                const outNodes = []
                narr.forEach((node) => {
                    if (node.next) {
                        innerNodes.push({
                            id: node.id,
                            text: node.text,
                            style: node.style,
                            editable: node.editable,
                        })
                        node.next.forEach((id) => {
                            if (nids.has(id)) {
                                innerNodes.push({
                                    id: node.id,
                                    text: node.text,
                                    link: node.link,
                                    next: [id],
                                })
                            } else {
                                outNodes.push({
                                    id: node.id,
                                    text: node.text,
                                    link: node.link,
                                    next: [id],
                                })
                            }
                        })
                    } else {
                        innerNodes.push(node)
                    }
                })
                const innerNodesStr = buildNodesStr(innerNodes)
                const outNodeStr = buildNodesStr(outNodes)
                return `subgraph ${groupName} \n ${innerNodesStr} end \n ${outNodeStr}`
            } else {
                const nodesStr = buildNodesStr(narr)
                return nodesStr
            }
        })
        .join(' \n')
}
function buildNodesStr(nodes) {
    return (
        nodes
            .map((item) => {
                if (item.next && item.next.length > 0) {
                    return item.next
                        .map((n, index) => {
                            const next = nodeObject.value[n] || nodeObject.value[n.id];
                            if (next != null && typeof next != 'undefined') {
                                return `${buildNode(item)}${buildLink(
                                    item,
                                    index
                                )}${buildNode(next)}`
                            } else {
                                //TODO error
                                return `${buildNode(item)}`
                            }
                        })
                        .join('\n')
                } else {
                    return `${buildNode(item)}`
                }
            })
            .join('\n') +
        '\n' +
        nodes
            .filter((item) => item.editable)
            .map((item) => {
                return `click ${item.id} mermaidClick`
            })
            .join('\n') +
        '\n' +
        nodes
            .filter((item) => item.url)
            .map((item) => {
                return `click ${item.id} "${item.url}"`
            })
            .join('\n') +
        '\n'
    )
}
function buildNode(item) {
    let edge = !item.edgeType
        ? edges.find((e) => {
            return e.type === 'default'
        })
        : edges.find((e) => {
            return e.type === item.edgeType
        })
    return `${item.id}${edge.open}${item.text}${edge.close}`
}
function buildLink(item, index) {
    const link = '-->'
    if (item.link) {
        if (Array.isArray(item.link)) {
            if (item.link.length > index) return item.link[index]
            else return item.link[item.link.length - 1]
        } else {
            return item.link
        }
    }
    return link
}

console.log(parseCode.value)

const diagram = computed(() => endent`
      flowchart LR
        A --> B
    `)

</script>

<template>
    <div>
        <vue-mermaid-string :value="parseCode" :options="{ maxTextSize: 10000 }" />
    </div>
</template>

<style module>
    .chart {
        display: block;
        width: 100%;
        height: 100%;
        color: black;
    }

    .chart :global(.flowchart) {
        width: 100%;
        height: 100%;
    }
</style>
