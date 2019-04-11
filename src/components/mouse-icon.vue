<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       class="mouse-icon"
       viewBox="0 0 100 100"
       :width="width"
       :height="height"
       :aria-labelledby="name"
  >
    <title :id="name" lang="en">
      {{ name }}
    </title>
      <g v-if="name === 'left'">
        <rect id="svg_2" height="5.571" width="1.5" y="5" x="14.347"/>
        <rect id="svg_3" height="5.571" width="1.5" y="19.623" x="14.347"/>
        <rect id="svg_4" height="1.5" width="5.572" y="14.347" x="5"/>
        <rect id="svg_5" height="1.5" width="5.569" y="14.347" x="19.626"/>
        <rect id="svg_6" height="1.5" width="5.57" transform="matrix(0.7071,-0.7071,0.7071,0.7071,5.4834,32.3407) " y="-6.145259" x="23.518405"/>
        <rect id="svg_7" height="1.5" width="5.57" transform="matrix(0.7069,-0.7073,0.7073,0.7069,-4.8556,28.0698) " y="4.193364" x="13.184634"/>
        <rect id="svg_8" height="5.569" width="1.5" transform="matrix(0.7071,-0.7071,0.7071,0.7071,2.4546,25.0285) " y="-8.179259" x="15.212405"/>
        <rect id="svg_9" height="5.57" width="1.5" transform="matrix(-0.7071,0.7071,-0.7071,-0.7071,85.389,4.4183) " y="32.055259" x="56.505595"/>
        <path id="svg_10" stroke-width="2" stroke="#000000" fill="black" d="m51.976,76.969l0,-40.165c0,-6.416 -5.22,-11.635 -11.635,-11.635l-14.36,0c-6.415,0 -11.634,5.219 -11.634,11.635l0,40.914l0.079,0c0.395,10.011 8.663,18.032 18.768,18.032c10.357,0 18.782,-8.425 18.782,-18.781zm-1.502,-40.165l0,40.165c0,9.53 -7.753,17.282 -17.282,17.282s-17.282,-7.753 -17.282,-17.282l0,-0.75l-0.064,0l0,-29.405l4.299,4.3l1.061,-1.061l-5.359,-5.36l0,-4.174l10.594,10.595l1.061,-1.061l-11.656,-11.655l0,-1.594c0,-0.794 0.101,-1.563 0.275,-2.305l16.51,16.51l1.061,-1.061l-17.058,-17.058c0.397,-0.944 0.935,-1.815 1.584,-2.589l14.38,14.381l1.061,-1.061l-14.389,-14.39c0.752,-0.668 1.601,-1.225 2.527,-1.647l10.834,10.836l1.061,-1.061l-10.334,-10.333c0.838,-0.225 1.714,-0.356 2.622,-0.356l1.194,0l5.423,5.423l1.061,-1.061l-4.362,-4.363l11.045,0c5.588,0 10.135,4.547 10.135,10.135l-0.002,0z"/>
        <rect id="svg_x" stroke="#000000" height="20" width="4" y="2" x="-2" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" fill="#000000"/>
        <rect id="svg_y" stroke="#000000" height="4" width="20" y="-2" x="2" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" fill="#000000"/>
      </g>
      <g v-if="name === 'right'">
        <rect id="svg_2" height="5.571" width="1.5" y="4.625" x="41.129001"/>
        <rect id="svg_3" height="5.571" width="1.5" y="19.248" x="41.129001"/>
        <rect id="svg_4" height="1.5" width="5.572" y="13.972" x="46.404001"/>
        <rect id="svg_5" height="1.5" width="5.569" y="13.972" x="31.781001"/>
        <rect id="svg_6" height="1.5" width="5.57" transform="matrix(0.7071,0.7071,-0.7071,0.7071,23.8064,-38.3703) " y="24.013426" x="40.223574"/>
        <rect id="svg_7" height="1.5" width="5.57" transform="matrix(0.7069,0.7073,-0.7073,0.7069,34.1626,-42.6618) " y="34.358728" x="50.568877"/>
        <rect id="svg_8" height="5.569" width="1.5" transform="matrix(0.7071,0.7071,-0.7071,0.7071,26.835,-45.682) " y="21.978426" x="52.599574"/>
        <rect id="svg_9" height="5.57" width="1.5" transform="matrix(-0.7071,-0.7071,0.7071,-0.7071,85.3216,75.1275) " y="1.896574" x="72.681426"/>
        <path id="svg_10" stroke-width="2" stroke="#000000" fill="black" d="m23.782001,95.375c10.105,0 18.373,-8.021 18.768,-18.032l0.079,0l0,-40.914c0,-6.416 -5.219,-11.635 -11.634,-11.635l-14.36,0c-6.415,0 -11.635,5.219 -11.635,11.635l0,40.165c0,10.356 8.425,18.781 18.782,18.781zm-17.282,-58.946c0,-5.588 4.547,-10.135 10.135,-10.135l11.045,0l-4.362,4.363l1.061,1.061l5.423,-5.423l1.194,0c0.908,0 1.784,0.131 2.622,0.356l-10.334,10.333l1.061,1.061l10.834,-10.836c0.926,0.422 1.775,0.979 2.527,1.647l-14.389,14.39l1.061,1.061l14.38,-14.381c0.649,0.774 1.187,1.645 1.584,2.589l-17.058,17.058l1.061,1.061l16.51,-16.51c0.174,0.742 0.275,1.511 0.275,2.305l0,1.594l-11.656,11.655l1.061,1.061l10.594,-10.595l0,4.174l-5.359,5.36l1.061,1.061l4.299,-4.3l0,29.405l-0.064,0l0,0.75c0,9.529 -7.753,17.282 -17.282,17.282s-17.282,-7.752 -17.282,-17.282l0,-40.165l-0.002,0z"/>
        <rect id="svg_x" stroke="#000000" height="20" width="4" y="2" x="-2" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" fill="#000000"/>
        <rect id="svg_y" stroke="#000000" height="4" width="20" y="-2" x="2" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" fill="#000000"/>
      </g>
      <g v-if="name === 'double'">
        <rect id="svg_2" height="5.571" width="1.5" y="5" x="39.538"/>
        <rect id="svg_3" height="5.571" width="1.5" y="19.623" x="39.538"/>
        <rect id="svg_4" height="1.5" width="5.572" y="14.347" x="30.191"/>
        <rect id="svg_5" height="1.5" width="5.57" y="14.347" x="44.816"/>
        <rect id="svg_6" height="1.5" width="5.57" transform="matrix(0.7071,-0.7071,0.7071,0.7071,9.1721,41.247) " y="2.761836" x="45.020501"/>
        <rect id="svg_7" height="1.5" width="5.571" transform="matrix(0.7071,-0.7071,0.7071,0.7071,-1.168,36.9644) " y="13.101836" x="34.679501"/>
        <rect id="svg_8" height="5.571" width="1.5" transform="matrix(0.7071,-0.7071,0.7071,0.7071,6.1439,33.9351) " y="0.725836" x="36.714501"/>
        <rect id="svg_9" height="5.57" width="1.5" transform="matrix(-0.7071,0.7071,-0.7071,-0.7071,106.8918,-4.4896) " y="23.148164" x="60.196499"/>
        <rect id="svg_10" height="5.571" width="1.5" y="5" x="14.348"/>
        <rect id="svg_11" height="5.571" width="1.5" y="19.623" x="14.348"/>
        <rect id="svg_12" height="1.5" width="5.572" y="14.347" x="5"/>
        <rect id="svg_13" height="1.5" width="5.57" y="14.347" x="19.625"/>
        <rect id="svg_14" height="1.5" width="5.571" transform="matrix(0.7072,-0.707,0.707,0.7072,1.7926,23.4297) " y="2.761765" x="19.827647"/>
        <rect id="svg_15" height="1.5" width="5.571" transform="matrix(0.707,-0.7072,0.7072,0.707,-8.5464,19.1567) " y="13.101907" x="9.491355"/>
        <rect id="svg_16" height="5.57" width="1.5" transform="matrix(0.7071,-0.7071,0.7071,0.7071,-1.2344,16.1228) " y="0.726836" x="11.524501"/>
        <rect id="svg_17" height="5.571" width="1.5" transform="matrix(-0.7071,0.7071,-0.7071,-0.7071,63.8872,13.3231) " y="23.148164" x="35.004499"/>
        <path id="svg_18" stroke-width="2" stroke="#000000" fill="black" d="m77.166,76.969l0,-40.165c0,-6.416 -5.219,-11.635 -11.634,-11.635l-14.359,0c-6.415,0 -11.635,5.219 -11.635,11.635l0,40.914l0.078,0c0.395,10.011 8.663,18.032 18.769,18.032c10.356,0 18.781,-8.425 18.781,-18.781zm-1.503,-40.165l0,40.165c0,9.53 -7.752,17.282 -17.281,17.282c-9.53,0 -17.283,-7.753 -17.283,-17.282l0,-0.75l-0.063,0l0,-29.406l4.3,4.301l1.061,-1.061l-5.36,-5.361l0,-4.173l10.595,10.595l1.061,-1.061l-11.655,-11.655l0,-1.594c0,-0.794 0.101,-1.563 0.275,-2.305l16.51,16.51l1.061,-1.061l-17.058,-17.059c0.397,-0.944 0.934,-1.815 1.584,-2.589l14.379,14.381l1.061,-1.061l-14.389,-14.39c0.752,-0.667 1.601,-1.224 2.527,-1.646l10.835,10.836l1.061,-1.061l-10.335,-10.333c0.839,-0.225 1.715,-0.356 2.623,-0.356l1.193,0l5.423,5.423l1.061,-1.061l-4.362,-4.363l11.045,0c5.588,0 10.134,4.547 10.134,10.135l-0.003,0z"/>
        <rect id="svg_x" stroke="#000000" height="20" width="4" y="2" x="-2" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" fill="#000000"/>
        <rect id="svg_y" stroke="#000000" height="4" width="20" y="-2" x="2" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" fill="#000000"/>
      </g>
      <g v-if="name === 'move'">
        <rect id="svg_x" stroke="#000000" height="40" width="8" y="2" x="-4" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" fill="#000000"/>
        <rect id="svg_y" stroke="#000000" height="8" width="40" y="-4" x="2" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" fill="#000000"/>
        <line id="svg_2" fill="none" stroke="#000000" stroke-width="5" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x1="50" y1="20" x2="50" y2="80" marker-start="url(#se_marker_start_svg_2)" marker-end="url(#se_marker_end_svg_2)"/>
        <line id="svg_4"fill="none" stroke="#000000" stroke-width="5" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x1="20" y1="50" x2="80" y2="50" marker-start="url(#se_marker_start_svg_4)" marker-end="url(#se_marker_end_svg_4)"/>
      </g>
      <defs>
        <marker id="se_marker_start_svg_2" markerUnits="strokeWidth" orient="auto" viewBox="0 0 100 100" markerWidth="5" markerHeight="5" refX="50" refY="50">
          <path id="svg_1" d="m0,50l100,40l-30,-40l30,-40l-100,40z" fill="#000000" stroke="#000000" stroke-width="10"/>
        </marker>
        <marker id="se_marker_end_svg_2" markerUnits="strokeWidth" orient="auto" viewBox="0 0 100 100" markerWidth="5" markerHeight="5" refX="50" refY="50">
          <path id="svg_3" d="m100,50l-100,40l30,-40l-30,-40l100,40z" fill="#000000" stroke="#000000" stroke-width="10"/>
        </marker>
        <marker id="se_marker_start_svg_4" markerUnits="strokeWidth" orient="auto" viewBox="0 0 100 100" markerWidth="5" markerHeight="5" refX="50" refY="50">
          <path id="svg_5" d="m0,50l100,40l-30,-40l30,-40l-100,40z" fill="#000000" stroke="#000000" stroke-width="10"/>
        </marker>
        <marker id="se_marker_end_svg_4" markerUnits="strokeWidth" orient="auto" viewBox="0 0 100 100" markerWidth="5" markerHeight="5" refX="50" refY="50">
          <path id="svg_6" d="m100,50l-100,40l30,-40l-30,-40l100,40z" fill="#000000" stroke="#000000" stroke-width="10"/>
        </marker>
      </defs>
      </g>
  </svg>
</template>

<script>
export default {
  name: 'mouse-icons',
  props: {
    name: {
      type: String,
      default: 'left'
    },
    width: {
      type: [Number, String],
      default: 100
    },
    height: {
      type: [Number, String],
      default: 100
    },
  },
  data () {
    return { }
  }
}
</script>

<style>
</style>
