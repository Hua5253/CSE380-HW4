import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";
import PriorityQueue from './PriorityQueue';

// TODO Construct a NavigationPath object using A*

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */

class AStarNode {
    index: number;
    f: number;
}

export default class AstarStrategy extends NavPathStrat {

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        // Get the closest nodes in the graph to our to and from positions
        let start = this.mesh.graph.snap(from);
        let end = this.mesh.graph.snap(to);
        let graph = this.mesh.graph;
    
        let openList = new PriorityQueue<AStarNode>((a, b) => a.f < b.f ? -1 : 1);
        let closedList = new Set<number>();
    
        let gValues = new Map<number, number>();
        let initialHValue = graph.getNodePosition(start).distanceTo(graph.getNodePosition(end));
        let fValues = new Map<number, number>();  // f = g + h
        let cameFrom = new Map<number, number>();  // key is index of position, value is the previous index of that position (eg: a -> b. key is index of b, value is the index of a)
    
        gValues.set(start, 0);  // initial g is 0;
        fValues.set(start, initialHValue);
    
        openList.enqueue({ index: start, f: fValues.get(start) });
    
        while (!openList.isEmpty()) {
            let current = openList.dequeue().index; // the current position node
        
            // reach the target
            if (current === end) {
                // Reconstruct the path
                let pathStack = new Stack<Vec2>(graph.numVertices);

                let currentNode = end;
                while (cameFrom.has(currentNode)) {
                    pathStack.push(graph.getNodePosition(currentNode));
                    currentNode = cameFrom.get(currentNode);
                }

                pathStack.push(graph.getNodePosition(start));
                console.log(pathStack);

                return new NavigationPath(pathStack);
            }

            closedList.add(current);

            let edges = graph.getEdges(current);
            while (edges) {
                let neighbor = edges.y;

                if (closedList.has(neighbor)) {
                    edges = edges.next;
                    continue;
                }

                let tentativeGValue = gValues.get(current) + edges.weight;

                if (!openList.contains(neighbor) || tentativeGValue < gValues.get(neighbor)) {
                    cameFrom.set(neighbor, current);
                    gValues.set(neighbor, tentativeGValue);

                    let hValue = graph.getNodePosition(neighbor).distanceTo(graph.getNodePosition(end));
                    fValues.set(neighbor, tentativeGValue + hValue);  // f = g + h

                    if (!openList.contains(neighbor)) {
                        openList.enqueue({ index: neighbor, f: fValues.get(neighbor) });
                    }
                }

                edges = edges.next;
            }
        }
    
        // No path found
        return new NavigationPath(new Stack<Vec2>());
    }
}
