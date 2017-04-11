var React = require('react');
var ProTypes = require('prop-types');
var api = require('../utils/api');


function RepoGrid(props) {
	return (
		<ul className='popular-list'>
			{props.repos.map((repo, index) => {
				return(
					<li key={repo.name} className='popular-item'>
						<div className='popular-rank'>#{index + 1}</div>
						<ul className='space-list-item'>
							<li>
								<img
									className='avatar'
									src={repo.owner.avatar_url}
									alt={'Avatar for ' + repo.owner.login}
								/>
							</li>
							<li><a href={repo.html_url}>{repo.name}</a></li>
							<li>@{repo.owner.login}</li>
							<li>{repo.stargazers_count} stars </li>
						</ul>
					</li>
				)
			})}
		</ul>
	)
}

RepoGrid.propTypes = {
	repos: ProTypes.array.isRequired
}
function SelectedLanguage(props) {
	var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
	
	return (
		<ul className='languages'>
			{languages.map(function(lang) {
				return (
					<li 
						style={lang === props.selectedLanguage ? { color: '#d0021b'}: null}
						key={lang} 
						onClick={props.onSelect.bind(null, lang)}>
						{lang}
					</li>
				)
			})}
		</ul>
	)
}

class Popular extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedLanguage: 'All',
			repos: null
		};
		this.updateLanguage = this.updateLanguage.bind(this);
	}

	componentDidMount() {
		this.updateLanguage(this.state.selectedLanguage);
	}

	updateLanguage(lang) {
		this.setState(() => {
			return {
				selectedLanguage: lang,
				repos: null
			}
		});

		api.fetchPopularRepos(lang)
			.then((repos) => {
				 this.setState(() => {
				 	console.log(repos);
				 	return {
				 		repos: repos
				 	}
				 })
			});
	}
	render() {
		return (
			<div>
				<SelectedLanguage 
					selectedLanguage={this.state.selectedLanguage}
					onSelect={this.updateLanguage}
				/>
				{!this.state.repos ? <p>Loading</p> : 
				<RepoGrid repos={this.state.repos}/>}
			</div>
		)
	}
}

SelectedLanguage.propTypes = {
	selectedLanguage: ProTypes.string.isRequired,
	onSelect: ProTypes.func.isRequired,
}

module.exports = Popular;