var documenterSearchIndex = {"docs":
[{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"EditURL = \"https://github.com/JuliaPlots/GraphMakie.jl/blob/master/docs/examples/interactions.jl\"","category":"page"},{"location":"generated/interactions/#Add-interactions-to-your-graph-plot","page":"Interaction Examples","title":"Add interactions to your graph plot","text":"","category":"section"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"In this example you will see, how to register interactions with your graph plot. We star with a simple wheel graph again. This time we use arrays for some attributes because we want to change them later in the interactions for individual nodes/edges.","category":"page"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"using CairoMakie\nCairoMakie.activate!(type=\"png\") # hide\nset_theme!(resolution=(800, 400)) #hide\nCairoMakie.inline!(true) # hide\nusing GraphMakie\nusing LightGraphs\nusing CairoMakie.Colors\n\nimport Random; Random.seed!(2) # hide\ng = wheel_graph(10)\nf, ax, p = graphplot(g,\n                     edge_width = [2.0 for i in 1:ne(g)],\n                     edge_color = [colorant\"gray\" for i in 1:ne(g)],\n                     node_size = [10 for i in 1:nv(g)],\n                     node_color = [colorant\"red\" for i in 1:nv(g)])\nhidedecorations!(ax); hidespines!(ax)\nax.aspect = DataAspect()\nf # hide","category":"page"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"Later on we want to enable drag interactions, therefore we disable the default :rectanglezoom interaction","category":"page"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"deregister_interaction!(ax, :rectanglezoom)\nnothing #hide","category":"page"},{"location":"generated/interactions/#Hover-interactions","page":"Interaction Examples","title":"Hover interactions","text":"","category":"section"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"At first, let's add some hover interaction for our nodes using the NodeHoverHandler constructor. We need to define a action function with the signature fun(state, idx, event, axis). We use the action to make the nodes bigger on hover events.","category":"page"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"function node_hover_action(state, idx, event, axis)\n    @info idx #hide\n    p.node_size[][idx] = state ? 20 : 10\n    p.node_size[] = p.node_size[] # trigger observable\nend\nnhover = NodeHoverHandler(node_hover_action)\nregister_interaction!(ax, :nhover, nhover)\n\nfunction set_cursor!(p) #hide\n    direction = Point2f0(-0.1, 0.2) #hide\n    arrows!([p-direction], [direction], linewidth=3, arrowsize=20, lengthscale=0.8) #hide\nend #hide\nnodepos = copy(p[:node_positions][]) #hide\nset_cursor!(nodepos[5] + Point2f0(0.05, 0)) #hide\np.node_size[][5] = 20; p.node_size[] = p.node_size[] #hide\nf #hide","category":"page"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"Please run the script locally with GLMakie.jl if you want to play with the Graph 🙂 The edge hover interaction is quite similar:","category":"page"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"pop!(ax.scene.plots) #hide\np.node_size[][5] = 10; p.node_size[] = p.node_size[] #hide\nfunction edge_hover_action(state, idx, event, axis)\n    @info idx #hide\n    p.edge_width[][idx]= state ? 5.0 : 2.0\n    p.edge_width[] = p.edge_width[] # trigger observable\nend\nehover = EdgeHoverHandler(edge_hover_action)\nregister_interaction!(ax, :ehover, ehover)\n\nset_cursor!((nodepos[4]+nodepos[1])/2) #hide\np.edge_width[][3] = 5.0; p.edge_width[] = p.edge_width[] #hide\nf #hide","category":"page"},{"location":"generated/interactions/#Click-interactions","page":"Interaction Examples","title":"Click interactions","text":"","category":"section"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"In a similar fashion we might change the color of nodes and lines by click.","category":"page"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"function node_click_action(idx, args...)\n    p.node_color[][idx] = rand(RGB)\n    p.node_color[] = p.node_color[]\nend\nnclick = NodeClickHandler(node_click_action)\nregister_interaction!(ax, :nclick, nclick)\n\nfunction edge_click_action(idx, args...)\n    p.edge_color[][idx] = rand(RGB)\n    p.edge_color[] = p.edge_color[]\nend\neclick = EdgeClickHandler(edge_click_action)\nregister_interaction!(ax, :eclick, eclick)\n\np.edge_color[][3] = colorant\"blue\"; p.edge_color[] = p.edge_color[] #hide\np.node_color[][7] = colorant\"yellow\" #hide\np.node_color[][2] = colorant\"brown\" #hide\np.node_color[][9] = colorant\"pink\" #hide\np.node_color[][6] = colorant\"green\" #hide\np.node_color[] = p.node_color[] #hide\nf #hide","category":"page"},{"location":"generated/interactions/#Drag-interactions","page":"Interaction Examples","title":"Drag interactions","text":"","category":"section"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"pop!(ax.scene.plots) #hide\np.edge_width[][3] = 2.0; p.edge_width[] = p.edge_width[] #hide\nfunction node_drag_action(state, idx, event, axis)\n    p[:node_positions][][idx] = event.data\n    p[:node_positions][] = p[:node_positions][]\nend\nndrag = NodeDragHandler(node_drag_action)\nregister_interaction!(ax, :ndrag, ndrag)\n\np[:node_positions][][1] = nodepos[1] + Point2f0(1.0,0.5) #hide\np[:node_positions][] = p[:node_positions][] #hide\nset_cursor!(p[:node_positions][][1] + Point2f0(0.05, 0)) #hide\np.node_size[][1] = 20; p.node_size[] = p.node_size[] #hide\nf # hide","category":"page"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"The last example is not as straight forward. By dragging an edge we want to change the positions of both attached nodes. Therefore we need some more state inside the action. We can achieve this with a callable struct.","category":"page"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"pop!(ax.scene.plots) #hide\np.node_size[][1] = 10; p.node_size[] = p.node_size[] #hide\nmutable struct EdgeDragAction\n    init::Union{Nothing, Point2f0} # save click position\n    src::Union{Nothing, Point2f0}  # save src vertex position\n    dst::Union{Nothing, Point2f0}  # save dst vertex position\n    EdgeDragAction() = new(nothing, nothing, nothing)\nend\nfunction (action::EdgeDragAction)(state, idx, event, axis)\n    edge = collect(edges(g))[idx]\n    if state == true\n        if action.src===action.dst===action.init===nothing\n            action.init = event.data\n            action.src = p[:node_positions][][edge.src]\n            action.dst = p[:node_positions][][edge.dst]\n        end\n        offset = event.data - action.init\n        p[:node_positions][][edge.src] = action.src + offset\n        p[:node_positions][][edge.dst] = action.dst + offset\n        p[:node_positions][] = p[:node_positions][] # trigger change\n    elseif state == false\n        action.src = action.dst = action.init =  nothing\n    end\nend\nedrag = EdgeDragHandler(EdgeDragAction())\nregister_interaction!(ax, :edrag, edrag)\n\np[:node_positions][][3] = nodepos[3] + Point2f0(0.9,1.0) #hide\np[:node_positions][][4] = nodepos[4] + Point2f0(0.9,1.0) #hide\np[:node_positions][] = p[:node_positions][] #hide\npm = (p[:node_positions][][3] + p[:node_positions][][4])/2\nset_cursor!(pm) #hide\np.edge_width[][11] = 5.0; p.edge_width[] = p.edge_width[] #hide\nf # hide","category":"page"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"","category":"page"},{"location":"generated/interactions/","page":"Interaction Examples","title":"Interaction Examples","text":"This page was generated using Literate.jl.","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = GraphMakie","category":"page"},{"location":"#GraphMakie","page":"Home","title":"GraphMakie","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This is the Documentation for GraphMakie.","category":"page"},{"location":"","page":"Home","title":"Home","text":"This Package consists of two parts: a plot recipe for graphs types from LightGraphs.jl and some helper functions to add interactions to those plots.","category":"page"},{"location":"","page":"Home","title":"Home","text":"There are also plot examples and interaction examples pages.","category":"page"},{"location":"#The-graphplot-Recipe","page":"Home","title":"The graphplot Recipe","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"graphplot","category":"page"},{"location":"#GraphMakie.graphplot","page":"Home","title":"GraphMakie.graphplot","text":"graphplot(graph::AbstractGraph)\ngraphplot!(ax, graph::AbstractGraph)\n\nCreates a plot of the network graph. Consists of multiple steps:\n\nLayout the nodes: the layout attribute is has to be a function f(adj_matrix)::pos where pos is either an array of Point2f0 or (x, y) tuples\nplot edges as linesegments-plot\nplot nodes as scatter-plot\nif nlabels!=nothing plot node labels as text-plot\nif elabels!=nothing plot edge labels as text-plot\n\nThe main attributes for the subplots are exposed as attributes for graphplot. Additional attributes for the scatter, linesegments and text plots can be provided as a named tuples to node_attr, edge_attr, nlabels_attr and elabels_attr.\n\nMost of the arguments can be either given as a vector of length of the edges/nodes or as a single value. One might run into errors when changing the underlying graph and therefore changing the number of Edges/Nodes.\n\nAttributes\n\nMain attributes\n\nlayout: function adj_matrix->Vector{Point} determines the base layout\nnode_color=scatter_theme.color\nnode_size=scatter_theme.markersize\nnode_marker=scatter_theme.markerk\nnode_attr=(;): List of kw arguments which gets passed to the scatter command\nedge_color=lineseg_theme.color: Pass a vector with 2 colors per edge to get color gradients.\nedge_width=lineseg_theme.linewidth: Pass a vector with 2 width per edge to get pointy edges.\nedge_attr=(;): List of kw arguments which gets passed to the linesegments command\narrow_show=Makie.automatic: Bool, indicate edge directions with arrowheads? Defaults to true for SimpleDiGraph and false otherwise.\narrow_size=scatter_theme.markersize: Size of arrowheads.\narrow_shift=0.5: Shift arrow position from source (0) to dest (1) node.\narrow_attr=(;): List of kw arguments which gets passed to the scatter command\n\nNode labels\n\nThe position of each label is determined by the node position plus an offset in data space.\n\nnlabels=nothing: Vector{String} with label for each node\nnlabels_align=(:left, :bottom): Anchor of text field.\nnlabels_color=labels_theme.color\nnlabels_offset=nothing: Point or Vector{Point}\nnlabels_textsize=labels_theme.textsize\nnlabels_attr=(;): List of kw arguments which gets passed to the text command\n\nEdge labels\n\nThe base position of each label is determinded by src + shift*(dst-src). The additional distance parameter is given in pixels and shifts the text away from the edge.\n\nelabels=nothing: Vector{String} with label for each edge\nelabels_align=(:center, :bottom): Anchor of text field.\nelabels_distance=0.0: Pixel distance of anchor to edge.\nelabels_shift=0.5: Position between src and dst of edge.\nelabels_opposite=Int[]: List of edge indices, for which the label should be displayed on the opposite side\nelabels_rotation=nothing: Angle of text per label. If nothing this will be determined by the edge angle!\nelabels_offset=nothing: Additional offset in data space\nelabels_color=labels_theme.color\nelabels_textsize=labels_theme.textsize\nelabels_attr=(;): List of kw arguments which gets passed to the text command\n\n\n\n\n\n","category":"function"},{"location":"#Predefined-Interactions","page":"Home","title":"Predefined Interactions","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"GraphMakie.jl provides some pre-built interactions to enable drag&drop of nodes and edges as well as highlight on hover.","category":"page"},{"location":"","page":"Home","title":"Home","text":"To try them all use the following code in a GLMakie environment.","category":"page"},{"location":"","page":"Home","title":"Home","text":"using GLMakie\nusing GraphMakie\nusing LightGraphs\ng = wheel_graph(10)\nf, ax, p = graphplot(g, edge_width=[3 for i in 1:ne(g)],\n                     node_size=[10 for i in 1:nv(g)])\n\nderegister_interaction!(ax, :rectanglezoom)\nregister_interaction!(ax, :nhover, NodeHoverHighlight(p))\nregister_interaction!(ax, :ehover, EdgeHoverHighlight(p))\nregister_interaction!(ax, :ndrag, NodeDrag(p))\nregister_interaction!(ax, :edrag, EdgeDrag(p))","category":"page"},{"location":"","page":"Home","title":"Home","text":"NodeHoverHighlight\nEdgeHoverHighlight\nNodeDrag\nEdgeDrag","category":"page"},{"location":"#GraphMakie.NodeHoverHighlight","page":"Home","title":"GraphMakie.NodeHoverHighlight","text":"NodeHoverHeighlight(p::GraphPlot, factor=2)\n\nMagnifies the node_size of node under cursor by factor.\n\nExample\n\njulia> g = wheel_graph(10)\njulia> f, ax, p = graphplot(g, node_size = [20 for i in 1:nv(g)])\njulia> register_interaction!(ax, :nodehover, NodeHoverHighlight(p))\n\n\n\n\n\n","category":"function"},{"location":"#GraphMakie.EdgeHoverHighlight","page":"Home","title":"GraphMakie.EdgeHoverHighlight","text":"EdgeHoverHeighlight(p::GraphPlot, factor=2)\n\nMagnifies the edge_width of edge under cursor by factor. If arrow_size isa Vector{<:Real} it also magnefies the arrow scatter.\n\nExample\n\njulia> g = wheel_digraph(10)\njulia> f, ax, p = graphplot(g, edge_width = [3 for i in 1:ne(g)],\n                               arrow_size=[10 for i in 1:ne(g)])\njulia> register_interaction!(ax, :nodehover, EdgeHoverHighlight(p))\n\n\n\n\n\n","category":"function"},{"location":"#GraphMakie.NodeDrag","page":"Home","title":"GraphMakie.NodeDrag","text":"NodeDrag(p::GraphPlot)\n\nAllows drag and drop of Nodes. Please deregister the :rectanglezoom interaction.\n\nExample\n\njulia> g = wheel_graph(10)\njulia> f, ax, p = graphplot(g, node_size = [10 for i in 1:nv(g)])\njulia> deregister_interaction!(ax, :rectanglezoom)\njulia> register_interaction!(ax, :nodehover, NodeHoverHighlight(p))\njulia> register_interaction!(ax, :nodedrag, NodeDrag(p))\n\n\n\n\n\n","category":"function"},{"location":"#GraphMakie.EdgeDrag","page":"Home","title":"GraphMakie.EdgeDrag","text":"EdgeDrag(p::GraphPlot)\n\nAllows drag and drop of Edges. Please deregister the :rectanglezoom interaction.\n\nExample\n\njulia> g = wheel_graph(10)\njulia> f, ax, p = graphplot(g, edge_width = [3 for i in 1:ne(g)])\njulia> deregister_interaction!(ax, :rectanglezoom)\njulia> register_interaction!(ax, :edgehover, EdgeHoverHighlight(p))\njulia> register_interaction!(ax, :edgedrag, EdgeDrag(p))\n\n\n\n\n\n","category":"function"},{"location":"#Interaction-Interface","page":"Home","title":"Interaction Interface","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"GraphMakie.jl provides some helper functions to register interactions to your graph plot. There are special interaction types for hovering, clicking and draging nodes and edges. For more information on the axis interaction please consult the Makie.jl docs.","category":"page"},{"location":"","page":"Home","title":"Home","text":"The general idea is to create some handler type, provide some action function and register it as an interaction with the axes.","category":"page"},{"location":"#Click-Interactions","page":"Home","title":"Click Interactions","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"NodeClickHandler\nEdgeClickHandler","category":"page"},{"location":"#GraphMakie.NodeClickHandler","page":"Home","title":"GraphMakie.NodeClickHandler","text":"NodeClickHandler(fun)\n\nInitializes ClickHandler for nodes. Calls function\n\nfun(idx, event, axis)\n\non left-click events where idx is the node index.\n\nExample\n\njulia> using Makie.Colors\njulia> g = wheel_digraph(10)\njulia> f, ax, p = graphplot(g, node_size=30, node_color=[colorant\"red\" for i in 1:nv(g)])\njulia> function action(idx, event, axis)\n           p.node_color[][idx] = rand(RGB)\n           p.node_color[] = p.node_color[]\n       end\njulia> register_interaction!(ax, :nodeclick, NodeClickHandler(action))\n\n\n\n\n\n","category":"function"},{"location":"#GraphMakie.EdgeClickHandler","page":"Home","title":"GraphMakie.EdgeClickHandler","text":"EdgeClickHandler(fun)\n\nInitializes ClickHandler for edges. Calls function\n\nfun(idx, event, axis)\n\non left-click events where idx is the edge index.\n\nExample\n\njulia> using Makie.Colors\njulia> g = wheel_digraph(10)\njulia> f, ax, p = graphplot(g, edge_width=4, edge_color=[colorant\"black\" for i in 1:ne(g)])\njulia> function action(idx, event, axis)\n           p.edge_color[][idx] = rand(RGB)\n           p.edge_color[] = p.edge_color[]\n       end\njulia> register_interaction!(ax, :edgeclick, EdgeClickHandler(action))\n\n\n\n\n\n","category":"function"},{"location":"#Hover-Interactions","page":"Home","title":"Hover Interactions","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"NodeHoverHandler\nEdgeHoverHandler","category":"page"},{"location":"#GraphMakie.NodeHoverHandler","page":"Home","title":"GraphMakie.NodeHoverHandler","text":"NodeHoverHandler(fun)\n\nInitializes HoverHandler for nodes. Calls function\n\nfun(hoverstate, idx, event, axis)\n\nwith hoverstate=true on hover and false at the end of hover. idx is the node index.\n\nExample\n\njulia> g = wheel_digraph(10)\njulia> f, ax, p = graphplot(g, node_size = [20 for i in 1:nv(g)])\njulia> function action(state, idx, event, axis)\n           p.node_size[][idx] = state ? 40 : 20\n           p.node_size[] = p.node_size[] #trigger observable\n       end\njulia> register_interaction!(ax, :nodehover, NodeHoverHandler(action))\n\n\n\n\n\n","category":"function"},{"location":"#GraphMakie.EdgeHoverHandler","page":"Home","title":"GraphMakie.EdgeHoverHandler","text":"EdgeHoverHandler(fun)\n\nInitializes HoverHandler for edges. Calls function\n\nfun(hoverstate, idx, event, axis)\n\nwith hoverstate=true on hover and false at the end of hover. idx is the edge index.\n\nExample\n\njulia> g = wheel_digraph(10)\njulia> f, ax, p = graphplot(g, edge_width = [3.0 for i in 1:ne(g)])\njulia> function action(state, idx, event, axis)\n           p.edge_width[][idx] = state ? 6.0 : 3.0\n           p.edge_width[] = p.edge_width[] #trigger observable\n       end\njulia> register_interaction!(ax, :edgehover, EdgeHoverHandler(action))\n\n\n\n\n\n","category":"function"},{"location":"#Drag-Interactions","page":"Home","title":"Drag Interactions","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"NodeDragHandler\nEdgeDragHandler","category":"page"},{"location":"#GraphMakie.NodeDragHandler","page":"Home","title":"GraphMakie.NodeDragHandler","text":"NodeDragHandler(fun)\n\nInitializes DragHandler for Nodes. Calls function\n\nfun(dragstate, idx, event, axis)\n\nwhere dragstate=true during the drag and false at the end of the drag, the last time fun is triggered. idx is the node index.\n\nExample\n\njulia> g = wheel_digraph(10)\njulia> f, ax, p = graphplot(g, node_size=20)\njulia> deregister_interaction!(ax, :rectanglezoom)\njulia> function action(state, idx, event, axis)\n           p[:node_positions][][idx] = event.data\n           p[:node_positions][] = p[:node_positions][]\n       end\njulia> register_interaction!(ax, :nodedrag, NodeDragHandler(action))\n\n\n\n\n\n","category":"function"},{"location":"#GraphMakie.EdgeDragHandler","page":"Home","title":"GraphMakie.EdgeDragHandler","text":"EdgeDragHandler(fun)\n\nInitializes DragHandler for Edges. Calls function\n\nfun(dragstate, idx, event, axis)\n\nwhere dragstate=true during the drag and false at the end of the drag, the last time fun is triggered. idx is the edge index.\n\nSee EdgeDrag for a concrete implementation. ```\n\n\n\n\n\n","category":"function"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"EditURL = \"https://github.com/JuliaPlots/GraphMakie.jl/blob/master/docs/examples/plots.jl\"","category":"page"},{"location":"generated/plots/#Plotting-Graphs-with-GraphMakie.jl","page":"Plot Examples","title":"Plotting Graphs with GraphMakie.jl","text":"","category":"section"},{"location":"generated/plots/#The-graphplot-Command","page":"Plot Examples","title":"The graphplot Command","text":"","category":"section"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"Plotting your first AbstractGraph from LightGraphs.jl is as simple as","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"using CairoMakie\nCairoMakie.activate!(type=\"png\") # hide\nset_theme!(resolution=(800, 400)) #hide\nCairoMakie.inline!(true) # hide\nusing GraphMakie\nusing LightGraphs\nimport Random; Random.seed!(2) # hide\n\ng = wheel_graph(10)\nf, ax, p = graphplot(g)\nhidedecorations!(ax); hidespines!(ax)\nax.aspect = DataAspect()\nf # hide","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"The graphplot command is a recipe which wraps several steps","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"layout the graph in 2D space using a layout function,\ncreate a scatter plot for the nodes and\ncreate a linesegments plot for the edges.","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"The default layout is NetworkLayout.Spring.layout from NetworkLayout.jl. The layout attribute can be any function which takes the adjacency matrix of the graph an returns a list of (x,y) tuples or Point2f0 objects.","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"Besides that there are some common attributes which are forwarded to the underlying plot commands. See graphplot.","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"using GraphMakie.NetworkLayout\n\ng = SimpleGraph(5)\nadd_edge!(g, 1, 2); add_edge!(g, 2, 4);\nadd_edge!(g, 4, 3); add_edge!(g, 3, 2);\nadd_edge!(g, 2, 5); add_edge!(g, 5, 4);\nadd_edge!(g, 4, 1); add_edge!(g, 1, 5);\n\n# define some edge colors\nedgecolors = [:black for i in 1:ne(g)]\nedgecolors[4] = edgecolors[7] = :red\n\nf, ax, p = graphplot(g, layout=NetworkLayout.Circular.layout,\n                     node_color=[:black, :red, :red, :red, :black],\n                     edge_color=edgecolors)\n\nhidedecorations!(ax); hidespines!(ax)\nax.aspect = DataAspect()\nf #hide","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"We can interactively change the attributes as usual with Makie.","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"fixed_layout(_) = [(0,0), (0,1), (0.5, 1.5), (1,1), (1,0)]\n# set new layout\np.layout = fixed_layout; autolimits!(ax)\n# change edge width & color\np.edge_width = 5.0\np.edge_color[][3] = :green;\np.edge_color = p.edge_color[] # trigger observable\nf #hide","category":"page"},{"location":"generated/plots/#Adding-Node-Labels","page":"Plot Examples","title":"Adding Node Labels","text":"","category":"section"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"Random.seed!(2)\ng = wheel_graph(10)\n\ncolors = [:black for i in 1:nv(g)]\ncolors[1] = :red\n\nf, ax, p = graphplot(g,\n                     nlabels=repr.(1:nv(g)),\n                     nlabels_color=colors,\n                     nlabels_align=(:center,:center))\nhidedecorations!(ax); hidespines!(ax); ax.aspect = DataAspect()\nf # hide","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"This is not very nice, lets change the offsets based on the node_positions","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"offsets = 0.15 * (p[:node_positions][] .- p[:node_positions][][1])\noffsets[1] = Point2f0(0, 0.3)\np.nlabels_offset[] = offsets\nautolimits!(ax)\nf # hide","category":"page"},{"location":"generated/plots/#Adding-Edge-Labels","page":"Plot Examples","title":"Adding Edge Labels","text":"","category":"section"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"Random.seed!(42)\ng = barabasi_albert(6, 2)\n\nlabels =  repr.(1:ne(g))\n\nf, ax, p = graphplot(g, elabels=labels,\n                     elabels_color=[:black for i in 1:ne(g)],\n                     edge_color=[:black for i in 1:ne(g)])\nhidedecorations!(ax); hidespines!(ax); ax.aspect = DataAspect()\nf # hide","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"The position of the edge labels is determined by several plot arguments. Each label is placed in the middle of the edge and rotated to match the edge rotation.","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"Note: Since the text is displayed in the screen system, this rotations only really works for DataAspect()! See the Makie docs.","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"The rotaion for each label can be overwritten with the elabels_rotation argument.","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"p.elabels_rotation[] = Vector{Union{Nothing, Float64}}(nothing, ne(g))\np.elabels_rotation[][5] = 0.0 # set absolute rotation angle for label 5\np.elabels_rotation[] = p.elabels_rotation[]\nnothing #hide","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"The position of each label can be modified using different arguments.","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"elabels_opposite is a vector if edge indices which tells the plot to display labels on the oppisite site.\nelabels_offset will be added to the middle of the edge in axis coordinates\nelabels_distance increses/decreases the normal distance to the edge\nelabels_shift shifts the label along the edge\nelabels_align tells the text plot where to place the text in relation to the position","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"p.elabels_opposite[] = [4,7]\n\np.elabels_offset[] = [Point2f0(0.0, 0.0) for i in 1:ne(g)]\np.elabels_offset[][5] = Point2f0(-0.4,0)\np.elabels_offset[] = p.elabels_offset[]\n\np.elabels_shift[] = [0.5 for i in 1:ne(g)]\np.elabels_shift[][4] = 0.7\np.elabels_shift[][3] = 0.6\np.elabels_shift[] = p.elabels_shift[]\n\np.elabels_distance[] = zeros(ne(g))\np.elabels_distance[][8] = -.3\np.elabels_distance[] = p.elabels_distance[]\n\nf # hide","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"Is it a bird?","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"p.edge_width[] = 3.0\np.elabels_color[] = [:green, :red, :green, :green, :red, :goldenrod1, :green, :goldenrod1]\np.edge_color[] = [:green, :black, :green, :green, :black, :goldenrod1, :green, :goldenrod1]\np.elabels[] =[\"left\", \"There\\n should\\n be an add-\\n itional node\\n for the wings!\", \"right\", \"leg\", \"O\", \"beak\", \"leg\", \"weird\"]\nxlims!(ax, (-1.5,2.5))\nf #hide","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"","category":"page"},{"location":"generated/plots/","page":"Plot Examples","title":"Plot Examples","text":"This page was generated using Literate.jl.","category":"page"}]
}
