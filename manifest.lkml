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
  url: "https://YOUR_GITHUB_USERNAME.github.io/viz-simple-marketplace/simple.js"
  label: "@{VIS_LABEL}"
} 
