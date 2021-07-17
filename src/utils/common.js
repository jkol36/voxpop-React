export const showVoteNumberSign = (number, upVote) => {
  if (number > 0 && upVote) return `+${number}`
  if (number < 0 && !upVote) return `-${number}`
  return number
}
