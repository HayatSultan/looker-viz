project_name: "viz-simple-marketplace"

constant: VIS_LABEL {
  value: "Simple"
  export: override_optional
}

constant: VIS_ID {
  value: "simple-marketplace"
  export:  override_optional
}

visualization: {
  id: "@{VIS_ID}"
  url: "https://hayatsultan.github.io/looker-viz/simple.js"
  label: "@{VIS_LABEL}"
} 
