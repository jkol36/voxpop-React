import React from "react"
import { shallow } from "enzyme"
import Lyrics from "./Lyrics"

const lyrics =
  "[Sauce Money]\nI lay my gun fine, ideas be as bright as the sunshine\nShook the rap game with just one line\nWhen me and my niggas combine, all day, you know what?\nSometimes, I run with mad niggas who done time\nHit you with eight, from one nine, now you showin the vein\nMy shells is like information, go in your brain\nHoldin my slug, before you squeeze em show em the love\nBurn your fingertips so throw em a glove, understand me\nBefore my album drop, cop the Grammy, uncanny\nBought my first Role' from Manny\nDirty burners my crew never hand me, nigga we family\nYou not, get shot, get caught slippin like Dexter Manley\nWith at least ten lead, spray right, paint your skin red\nDamn we, all the shit you can't be\nWe big time, you small time, real small like how an ant be\nMarcy, bust a shot for Metcalf, Tilo and Danny\nPeace to the Bureils, Cut Wop and Stanley\nBoom Moet and bow, my whole set is wild\nPast threats, frontin flash singles and that's bent\nFuck a bitch, you know the drill\nCut a check or suck a dick\n\n[Jay-Z]\nJigga, what the fuck?\nAs a youth explosively, clappin off the roof\nShootin guard like Kobe, raised up slay smears and bo'e\nBack then, Gil was my co-d, Spanish Jose\nShowed me how to get the money niggas owed me\nFast forward, no kids, six cars and three Role's\nTwo cribs, trips to Cuba, sippin on Ooba\nGot rap in a stupor, first to clap your group up\nFrom the Range with the ski rack, or six with the roof up\nShit, I light the motherfuckin soundproof booth up\nNew shit, y'all say the same shit like you're looped up\nYour rap's all lazy, Jigga the Black Scorcese\nWhat your album lack is more Jay-Z\nCode name: Jay-hovah, all praise me\nY'all don't paint pictures, y'all all trace me\nYou've yet to see the day when my squad be done\nI represent that shit nigga, Marcy son, what?\n\n[Sauce Money]\nI grab my dick in front of your bitch, screaming \"Fuck your spot\"\nHeat miser, anything I ever touch was hot\nSauce watching all ya wildcats flop, sound greasy\nOne song on your whole CD, making my job easy\nFigured as much though, got your hustle swinging\nCop a muzzle, then y'all got the nerve to drop a double?\nEverybody ain't B.I.G. nigga, everybody can't flow like Jigg Nigga\nBitch niggas listen: No sorrow tomorrow if you swallow hollow-points\nLike a dread in the weed spot, I'mma move some joints\nI ain't playing, these BK slugs spraying\nMute niggas could tell you how nice I am, it goes without saying\nMalicious, rap flow vicious, stack dough\nBitches suckin' dicks, they fat boy delicious\nPretentious niggas get it in slow-mo\nKodak couldn't picture that, so X-ray machines taking your team photo\nNiggas switching like a homo, shit on your team\nFuck how they feel, get all that CREAM\nHere comes the drama, here's the drummer, they call your number\nAnd now your fun-filled summer filled with bounty hunters\nIf a bitch fuck you for free, cats will kill you for the same fee\nThink niggas give a fuck what your name be? Or your raw crew?\nKid you're all saw-through\nMad cause you ain't blow yet, never fret nigga your bitch blew for you\nGet on some Prince shit like, \"I truly adore you\"\nNever, crab cat, fuck you, have that\nSauce mother F-U tricks all in the mix\n300 large on my flat up in the sticks\nNothing but a lot of leg room, my son and my bitch\nGetting fatter of salmon, croquets and grits\nPeace to all my niggas in Marcy, Viya Schmidt and Bits [?]\nL-channel henny and crime, nigga which?\nOne of y'all in the mirror looking facing them 8's\nOne in your helmet, might induce a case of the shakes\nB-scott, what the deal son? Reno where the dro at?\nSauce Money\nYou know that, nigga"

const spy = jest.fn()

let props = {
  score: 100,
  upvotes: 5,
  downvotes: 11,
  lyrics,
  onVoting: spy
}

const lyricsMock = props => shallow(<Lyrics {...props} />)

describe("Lyrics", () => {
  it("renders", () => {
    expect(lyricsMock(props)).toMatchSnapshot
  })

  it("renders voting overlay when there are highlighted words", () => {
    const component = lyricsMock(props)
    component.setState({ highLightedWords: "lorem ipsum" })
    expect(component).toMatchSnapshot
  })
})
